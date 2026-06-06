// XAVIERA BYPASS - ZerrSt4rr Ganteng Edition
(function() {
    'use strict';

    const SCRIPT_NAME = "ZerrSt4rr. Ganteng";
    const VERSION = "1.0";

    let currentUrl = window.location.href.toLowerCase();
    let currentHost = window.location.hostname.toLowerCase();
    let cleanUrl = currentHost + window.location.pathname.toLowerCase();

    let isAincrad = currentHost.includes('aincradmods.com') || currentHost.includes('aincrad.decryptvpn.xyz');
    let hasToken = currentUrl.includes('token=');

    let pCount = localStorage.getItem('xaviera_pageCount') ? parseInt(localStorage.getItem('xaviera_pageCount')) : 0;
    let startTime = localStorage.getItem('xaviera_startTime') ? parseInt(localStorage.getItem('xaviera_startTime')) : 0;
    let lastUrl = localStorage.getItem('xaviera_lastUrl') || '';

    if (isAincrad && !hasToken) {
        pCount = 0;
        startTime = 0;
        localStorage.setItem('xaviera_pageCount', 0);
        localStorage.setItem('xaviera_startTime', 0);
        localStorage.setItem('xaviera_lastUrl', cleanUrl);
    } else if (!isAincrad) {
        if (cleanUrl !== lastUrl) {
            pCount++;
            localStorage.setItem('xaviera_pageCount', pCount);
            localStorage.setItem('xaviera_lastUrl', cleanUrl);
            if (pCount === 1 || startTime === 0) {
                startTime = Date.now();
                localStorage.setItem('xaviera_startTime', startTime);
                console.log(`[${SCRIPT_NAME}] ⏱️ Timer Started!`);
            }
        }
    }

    let elapsedMs = 0;
    if (startTime > 0) {
        elapsedMs = Date.now() - startTime;
    }
    let remainingMs = 2000 - elapsedMs;
    if (remainingMs < 0 || startTime === 0) remainingMs = 0;

    if (!isAincrad) {
        const flagKey = 'xaviera_refreshed';
        if (!sessionStorage.getItem(flagKey)) {
            sessionStorage.setItem(flagKey, 'true');
            console.log(`[${SCRIPT_NAME}] 🔄 Auto refreshing...`);
            setTimeout(() => { location.reload(); }, 900);
            return;
        }
    }

    function createMainUI() {
        if (document.getElementById('xaviera-ui')) return;
        const uiHTML = `
            <div id="xaviera-ui" style="position:fixed;bottom:20px;right:20px;z-index:9999999;font-family:monospace;pointer-events:none;">
                <div style="background:rgba(0,0,0,0.9);border:1px solid #00ff88;border-radius:15px;padding:12px 18px;box-shadow:0 0 20px rgba(0,255,136,0.3);color:#00ff88;">
                    <div style="font-weight:bold;font-size:14px;">🔥 ZerrSt4rr. Ganteng</div>
                    <div style="font-size:10px;color:#aaa;">v${VERSION} • Bypass Active</div>
                </div>
            </div>
        `;
        const container = document.createElement('div');
        container.innerHTML = uiHTML.trim();
        document.body.appendChild(container.firstElementChild);
    }

    const targetTexts = [
        'C0NT!NU𝗔R', 'Continuar', 'Fechar', '𝗔V4NC@R', 'CL!QU3 𝗔QUІ!',
        'PR0SS3GU!R', 'Get Key', 'Continue', 'Copy Key'
    ];
    const normalize = (text) => text.trim().replace(/\s+/g, ' ').toLowerCase();
    const normalizedTargets = targetTexts.map(normalize);

    function isClickable(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0;
    }

    function doClick(el) {
        if (el && isClickable(el)) {
            el.click();
            return true;
        }
        return false;
    }

    function attemptClick() {
        const elements = document.querySelectorAll('button, a, input[type="button"], .btn');
        for (const el of elements) {
            if (normalizedTargets.includes(normalize(el.innerText || el.value || ''))) {
                doClick(el);
                return;
            }
        }
    }

    function init() {
        createMainUI();
        if (!isAincrad && pCount >= 5 && remainingMs > 0) {
            let waitDiv = document.createElement('div');
            waitDiv.style = "position:fixed;top:25px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.95);border:2px solid #00ff88;color:#00ff88;padding:15px 30px;z-index:9999999;border-radius:15px;text-align:center;";
            document.body.appendChild(waitDiv);
            let secs = Math.ceil(remainingMs / 1000);
            waitDiv.innerHTML = `⏳ Wait ${secs}s...`;
            let countdown = setInterval(function() {
                secs--;
                if (secs <= 0) {
                    clearInterval(countdown);
                    waitDiv.remove();
                    setInterval(attemptClick, 100);
                } else {
                    waitDiv.innerHTML = `⏳ Wait ${secs}s...`;
                }
            }, 1000);
        } else {
            setInterval(attemptClick, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
