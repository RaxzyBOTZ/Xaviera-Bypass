(function() {
    "use strict";

    if (typeof window.ZERR_BOOKMARK_LOAD === "undefined") {
        console.log("%cAccess Denied - Bookmark Required", "color:#ff0000;font-size:15px;font-weight:bold");
        return;
    }

    const CONFIG = {
        keyFile: "https://raw.githubusercontent.com/RaxzyBOTZ/Xaviera-Bypass/main/key.txt",
        redirectFile: "https://raw.githubusercontent.com/RaxzyBOTZ/Xaviera-Bypass/main/Zerr.txt",
        telegramFile: "https://raw.githubusercontent.com/RaxzyBOTZ/Xaviera-Bypass/main/button.txt",
        musicFile: "https://raw.githubusercontent.com/RaxzyBOTZ/Xaviera-Bypass/main/music.txt",
        updateCheck: "https://raw.githubusercontent.com/RaxzyBOTZ/Xaviera-Bypass/main/update.txt",
        modalStyle: "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(6,10,23,0.95);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#fff;padding:30px 25px;border-radius:16px;z-index:2147483647;font-family:system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.6);border:2px solid #00ffcc;width:300px;box-sizing:border-box;animation: zerr-lightning-glow 3s linear infinite;"
    };

    let audioPlayer = null;
    let redirectURL = null;

    function addStyles() {
        const style = document.createElement("style");
        style.textContent = `
            @keyframes zerr-lightning-glow {
                0% { box-shadow: 0 0 5px #ff00cc, 0 0 10px #ff00cc, inset 0 0 5px rgba(255,0,204,0.2); border-color: #ff00cc; }
                25% { box-shadow: 0 0 15px #ff00e6, 0 0 25px #ff00cc, inset 0 0 10px rgba(255,0,204,0.4); border-color: #ff00e6; }
                30% { box-shadow: 0 0 8px #ff00cc, 0 0 12px #ff00cc, inset 0 0 6px rgba(255,0,204,0.3); border-color: #ff00cc; }
                35% { box-shadow: 0 0 25px #ffff00, 0 0 40px #ff00cc, inset 0 0 15px rgba(255,0,204,0.5); border-color: #ffff00; }
                70% { box-shadow: 0 0 15px #ff00e6, 0 0 25px #ff00cc, inset 0 0 10px rgba(255,0,204,0.4); border-color: #ff00e6; }
                73% { box-shadow: 0 0 5px #ff00cc, 0 0 10px #ff00cc, inset 0 0 5px rgba(255,0,204,0.2); border-color: #ff00cc; }
                100% { box-shadow: 0 0 5px #ff00cc, 0 0 10px #ff00cc, inset 0 0 5px rgba(255,0,204,0.2); border-color: #ff00cc; }
            }
            @keyframes zerr-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            @keyframes zerr-fire-spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
            @keyframes zerr-pulse {
                0% { transform: scale(1); text-shadow: 0 0 5px #ff00cc; }
                50% { transform: scale(1.02); text-shadow: 0 0 20px #ff00cc, 0 0 30px #ff00cc; }
                100% { transform: scale(1); text-shadow: 0 0 5px #ff00cc; }
            }
            @keyframes zerr-gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            .zerr-glow-text {
                animation: zerr-pulse 2s ease-in-out infinite;
            }
            .zerr-gradient-text {
                background: linear-gradient(135deg, #ff00cc, #ff0066, #ff00cc, #ff00aa);
                background-size: 300% 300%;
                animation: zerr-gradient 3s ease infinite;
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                display: inline-block;
            }
        `;
        document.head.appendChild(style);
    }

    function createAuthModal() {
        const existingModal = document.getElementById("zerr-auth-box");
        if (existingModal) existingModal.remove();

        const modal = document.createElement("div");
        modal.id = "zerr-auth-box";
        modal.style.cssText = CONFIG.modalStyle;
        modal.innerHTML = `
            <button id="zerr-music-btn" style="position:absolute;top:15px;right:15px;background:rgba(255,255,255,0.1);border:1.5px solid rgba(255,0,204,0.5);color:#ff44aa;border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 10px rgba(255,0,204,0.3);transition:all 0.3s ease;z-index:10;backdrop-filter:blur(5px);">🔇</button>
            <div style="margin-bottom:8px;">
                <span style="font-size:28px;">👑</span>
            </div>
            <h3 style="margin:0 0 5px 0;font-size:24px;letter-spacing:2px;font-weight:900;" class="zerr-gradient-text">ZERR SYSTEM</h3>
            <p style="margin:0 0 3px 0;color:#00ffcc;font-size:11px;letter-spacing:3px;font-weight:700;">⚡ ZerrSt4rr EDITION ⚡</p>
            <p style="margin:0 0 20px 0;color:#64748b;font-size:10px;letter-spacing:1.5px;font-weight:500;">✦ ENTER LICENSE KEY ✦</p>
            <input type="text" id="zerr-key-input" placeholder="ENTER KEY HERE" style="width:100%;padding:12px;margin-bottom:16px;border:1.5px solid rgba(255,0,204,0.5);border-radius:10px;background:rgba(7,11,25,0.8);color:#fff;text-align:center;box-sizing:border-box;font-size:13px;font-weight:600;letter-spacing:1px;outline:none;transition:all 0.3s ease;box-shadow:inset 0 2px 4px rgba(0,0,0,0.5), 0 0 5px rgba(255,0,204,0.2);">
            <button id="zerr-login-btn" style="width:100%;background:linear-gradient(135deg, #ff00cc, #ff0066);color:#fff;border:none;padding:12px;border-radius:10px;font-weight:800;cursor:pointer;font-size:14px;letter-spacing:1px;margin-bottom:12px;box-shadow:0 4px 15px rgba(255,0,204,0.4);transition:all 0.2s ease;text-transform:uppercase;">✨ VERIFY & RUN ✨</button>
            <button id="zerr-telegram-btn" style="width:100%;background:linear-gradient(135deg, #0088cc, #006699);color:#fff;border:none;padding:12px;border-radius:10px;font-weight:700;cursor:pointer;font-size:14px;letter-spacing:0.5px;box-shadow:0 4px 12px rgba(0,136,204,0.3);transition:all 0.2s ease;">📱 TELEGRAM</button>
            <div id="zerr-status" style="margin-top:16px;font-size:11px;font-weight:600;color:#64748b;letter-spacing:1px;padding:5px;border-radius:8px;">READY</div>
        `;
        document.body.appendChild(modal);

        setTimeout(() => {
            modal.style.zIndex = "2147483647";
            if (window.innerWidth < 600) {
                modal.style.width = "90%";
                modal.style.maxWidth = "300px";
            }
        }, 10);

        return modal;
    }

    function setupMusicButton() {
        const musicBtn = document.getElementById("zerr-music-btn");
        if (!musicBtn) return;
        musicBtn.addEventListener("click", async () => {
            if (!audioPlayer) {
                try {
                    const response = await fetch(CONFIG.musicFile + "&t=" + Date.now());
                    const url = (await response.text()).trim();
                    if (url && url.startsWith("http")) {
                        audioPlayer = new Audio(url);
                        audioPlayer.loop = true;
                    } else {
                        console.log("Invalid audio URL");
                        return;
                    }
                } catch (e) { return; }
            }
            if (audioPlayer.paused) {
                audioPlayer.play().then(() => {
                    musicBtn.textContent = "🔊";
                    musicBtn.style.color = "#ff00cc";
                    musicBtn.style.borderColor = "#ff00cc";
                    musicBtn.style.boxShadow = "0 0 12px rgba(255,0,204,0.5)";
                }).catch(err => { console.log("Playback failed:", err); });
            } else {
                audioPlayer.pause();
                musicBtn.textContent = "🔇";
                musicBtn.style.color = "#ff4444";
                musicBtn.style.borderColor = "rgba(255,0,204,0.4)";
                musicBtn.style.boxShadow = "0 0 8px rgba(0,0,0,0.3)";
            }
        });
    }

    function setupInputField() {
        const inputField = document.getElementById("zerr-key-input");
        if (!inputField) return;
        inputField.addEventListener("focus", () => {
            inputField.style.border = "1.5px solid #ff00cc";
            inputField.style.boxShadow = "0 0 15px rgba(255,0,204,0.4), inset 0 2px 4px rgba(0,0,0,0.5)";
        });
        inputField.addEventListener("blur", () => {
            inputField.style.border = "1.5px solid rgba(255,0,204,0.5)";
            inputField.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.5), 0 0 5px rgba(255,0,204,0.2)";
        });
    }

    function setupTelegramButton() {
        const telegramBtn = document.getElementById("zerr-telegram-btn");
        if (!telegramBtn) return;
        telegramBtn.addEventListener("click", async () => {
            try {
                const response = await fetch(CONFIG.telegramFile + "?t=" + Date.now());
                const url = (await response.text()).trim();
                if (url.startsWith("http")) { window.open(url, "_blank"); }
            } catch (e) {}
        });
    }

    async function showRedirectOverlay(url) {
        const overlay = document.createElement("div");
        overlay.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); backdrop-filter:blur(3px); z-index:2147483647; display:flex; align-items:center; justify-content:center; font-family:system-ui,-apple-system,sans-serif;`;
        const countdownStart = Math.floor(Math.random() * 4) + 22;
        let currentCount = countdownStart;
        const circumference = 597;
        overlay.innerHTML = `<div style="text-align:center;"><div style="position:relative; width:250px; height:250px; margin:0 auto; display:flex; align-items:center; justify-content:center;"><div style="position:absolute; top:50%; left:50%; width:214px; height:214px; border-radius:50%; background:conic-gradient(transparent 0deg, #ff00cc 90deg, #ff0066 180deg, #ff00ff 270deg, transparent 360deg); filter: blur(14px); opacity:0.85; animation: zerr-fire-spin 1.5s linear infinite; z-index:1;"></div><div style="position:absolute; top:50%; left:50%; width:206px; height:206px; border-radius:50%; background:conic-gradient(transparent 0deg, #ff3300 60deg, #ff5500 120deg, #ffaa00 240deg, transparent 360deg); filter: blur(6px); opacity:0.9; animation: zerr-fire-spin 1s linear infinite reverse; z-index:2;"></div><svg width="240" height="240" style="transform:rotate(-90deg); position:relative; z-index:3;"><circle cx="120" cy="120" r="95" fill="rgba(6,10,23,0.65)" stroke="rgba(255,0,204,0.2)" stroke-width="14"></circle><circle id="zerr-progress" cx="120" cy="120" r="95" fill="none" stroke="#ff00cc" stroke-width="14" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" stroke-linecap="round" style="filter: drop-shadow(0 0 6px #ff00cc); transition: stroke-dashoffset 1s linear;"></circle></svg><div id="zerr-countdown-text" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:54px; font-weight:900; color:#fff; text-shadow:0 0 20px #ff00cc, 0 0 30px rgba(255,0,204,0.3); z-index:4;">${countdownStart}</div></div><p style="margin-top:30px; color:#ff00cc; font-size:16px; font-weight:700; letter-spacing:3px; text-shadow:0 0 12px rgba(255,0,204,0.4); position:relative; z-index:4;">⚡ REDIRECTING TO ZERR ⚡</p></div>`;
        document.body.appendChild(overlay);
        const progressCircle = overlay.querySelector("#zerr-progress");
        const countdownText = overlay.querySelector("#zerr-countdown-text");
        const interval = setInterval(() => {
            currentCount--;
            countdownText.textContent = currentCount;
            progressCircle.style.strokeDashoffset = circumference * (currentCount / countdownStart);
            if (currentCount <= 0) {
                clearInterval(interval);
                if (audioPlayer) { audioPlayer.pause(); audioPlayer = null; }
                overlay.remove();
                window.location.replace(url);
            }
        }, 1000);
    }

    async function showUpdateOverlay() {
        return new Promise(async (resolve) => {
            const updateOverlay = document.createElement("div");
            updateOverlay.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(6,10,23,0.9); backdrop-filter:blur(10px); z-index:2147483647; display:flex; align-items:center; justify-content:center; font-family:system-ui,-apple-system,sans-serif;`;
            updateOverlay.innerHTML = `<div style="text-align:center; background:rgba(6,10,23,0.98); padding:35px 30px; border-radius:20px; border:2px solid #ff00cc; width:300px; animation: zerr-lightning-glow 3s linear infinite; box-shadow:0 0 30px rgba(255,0,204,0.3);"><div style="width:50px; height:50px; border:4px solid rgba(255,0,204,0.1); border-top:4px solid #ff00cc; border-radius:50%; margin:0 auto 20px auto; animation: zerr-spin 0.8s linear infinite; box-shadow:0 0 15px rgba(255,0,204,0.3);"></div><p id="zerr-check-text" style="color:#ff00cc; font-size:15px; font-weight:700; margin:0; letter-spacing:1.5px; text-shadow:0 0 8px rgba(255,0,204,0.3);" class="zerr-glow-text">CHECKING UPDATE...</p></div>`;
            document.body.appendChild(updateOverlay);
            let updateAvailable = false;
            try {
                const updateCheck = await fetch(CONFIG.updateCheck);
                const updateData = await updateCheck.text();
                if (updateData.includes("GitHub Updated")) { updateAvailable = true; }
            } catch (e) {}
            await new Promise(r => setTimeout(r, 5000));
            const checkText = document.getElementById("zerr-check-text");
            if (checkText) {
                if (updateAvailable) {
                    checkText.innerHTML = "<span style='color:#00ffcc;'>✓ LINK UPDATED SUCCESSFULLY! ✓</span>";
                } else {
                    checkText.innerHTML = "<span style='color:#ff6666; text-shadow:0 0 8px rgba(255,102,102,0.3);'>✗ NO UPDATE AVAILABLE ✗</span>";
                }
            }
            await new Promise(r => setTimeout(r, 1500));
            updateOverlay.remove();
            resolve();
        });
    }

    async function handleSuccessfulLogin(modal, statusElement, loginBtn, telegramBtn) {
        statusElement.innerHTML = "<span style='color:#00ffcc; text-shadow:0 0 5px #00ffcc;'>✓ KEY VALIDATED! WELCOME ZERRST4RR! ✓</span>";
        setTimeout(async () => {
            modal.remove();
            await showUpdateOverlay();
            const redirectResponse = await fetch(CONFIG.redirectFile + "?t=" + Date.now());
            redirectURL = (await redirectResponse.text()).trim();
            if (redirectURL && redirectURL.startsWith("http")) {
                await showRedirectOverlay(redirectURL);
            }
        }, 1000);
    }

    function setupLoginButton(modal, statusElement, loginBtn, telegramBtn, inputField) {
        loginBtn.addEventListener("click", async () => {
            const inputKey = inputField.value.trim();
            if (!inputKey) {
                statusElement.innerHTML = "<span style='color:#ff6666;'>⚠️ PLEASE INPUT KEY! ⚠️</span>";
                return;
            }
            statusElement.innerHTML = "<span style='color:#ff00cc; text-shadow:0 0 8px rgba(255,0,204,0.5);'>🔗 CONNECTING TO ZERR SERVER...</span>";
            loginBtn.disabled = true;
            telegramBtn.disabled = true;
            try {
                const keyResponse = await fetch(CONFIG.keyFile + "?t=" + Date.now());
                const keyData = await keyResponse.text();
                const validKeys = keyData.split("\n").map(line => line.trim()).filter(line => line !== "");
                if (validKeys.includes(inputKey)) {
                    await handleSuccessfulLogin(modal, statusElement, loginBtn, telegramBtn);
                } else {
                    statusElement.innerHTML = "<span style='color:#ff6666;'>❌ INVALID LICENSE KEY! ❌</span>";
                    loginBtn.disabled = false;
                    telegramBtn.disabled = false;
                }
            } catch (e) {
                statusElement.innerHTML = "<span style='color:#ff6666;'>⚠️ SERVER ERROR! TRY AGAIN ⚠️</span>";
                loginBtn.disabled = false;
                telegramBtn.disabled = false;
            }
        });
    }

    async function init() {
        addStyles();
        const modal = createAuthModal();
        setupMusicButton();
        setupInputField();
        setupTelegramButton();
        const statusElement = document.getElementById("zerr-status");
        const loginBtn = document.getElementById("zerr-login-btn");
        const telegramBtn = document.getElementById("zerr-telegram-btn");
        const inputField = document.getElementById("zerr-key-input");
        if (loginBtn && inputField && statusElement && telegramBtn && modal) {
            setupLoginButton(modal, statusElement, loginBtn, telegramBtn, inputField);
        }
    }

    init();
})();
