// ============================================================
// ZXI BOOKMARK LOADER - CLEANED VERSION
// Password protected key system
// ============================================================

(function() {
    "use strict";

    // Check if loaded via bookmarklet
    if (typeof window.ZXI_BOOKMARK_LOAD === "undefined") {
        console.log("%cAccess Denied - Bookmark Required", "color:#ff0000;font-size:15px;font-weight:bold");
        return;
    }

    // Configuration
    const CONFIG = {
        keyFile: "https://zxi-file-loader.ah4734536.workers.dev/?file=key.txt",
        redirectFile: "https://zxi-file-loader.ah4734536.workers.dev/?file=zxi.txt",
        telegramFile: "https://zxi-file-loader.ah4734536.workers.dev/?file=button.txt",
        musicFile: "https://zxi-file-loader.ah4734536.workers.dev/?file=music.txt",
        updateCheck: "https://zxi.zxidesert.workers.dev/",
        modalStyle: "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(6,10,23,0.95);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#fff;padding:30px 25px;border-radius:16px;z-index:2147483647;font-family:system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.6);border:2px solid #00ffcc;width:300px;box-sizing:border-box;animation: zxi-lightning-glow 3s linear infinite;"
    };

    let audioPlayer = null;
    let redirectURL = null;

    // Add CSS animations
    function addStyles() {
        const style = document.createElement("style");
        style.textContent = `
            @keyframes zxi-lightning-glow {
                0% { box-shadow: 0 0 5px #00ffcc, 0 0 10px #00ffcc, inset 0 0 5px rgba(0,255,204,0.2); border-color: #00ffcc; }
                25% { box-shadow: 0 0 15px #00e6b8, 0 0 25px #00ffcc, inset 0 0 10px rgba(0,255,204,0.4); border-color: #00e6b8; }
                30% { box-shadow: 0 0 8px #00ffcc, 0 0 12px #00ffcc, inset 0 0 6px rgba(0,255,204,0.3); border-color: #00ffcc; }
                35% { box-shadow: 0 0 25px #00ffff, 0 0 40px #00ffcc, inset 0 0 15px rgba(0,255,204,0.5); border-color: #00ffff; }
                70% { box-shadow: 0 0 15px #00e6b8, 0 0 25px #00ffcc, inset 0 0 10px rgba(0,255,204,0.4); border-color: #00e6b8; }
                73% { box-shadow: 0 0 5px #00ffcc, 0 0 10px #00ffcc, inset 0 0 5px rgba(0,255,204,0.2); border-color: #00ffcc; }
                100% { box-shadow: 0 0 5px #00ffcc, 0 0 10px #00ffcc, inset 0 0 5px rgba(0,255,204,0.2); border-color: #00ffcc; }
            }
            @keyframes zxi-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes zxi-fire-spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // Create auth modal
    function createAuthModal() {
        // Remove existing if any
        const existingModal = document.getElementById("zxi-auth-box");
        if (existingModal) existingModal.remove();

        const modal = document.createElement("div");
        modal.id = "zxi-auth-box";
        modal.style.cssText = CONFIG.modalStyle;
        modal.innerHTML = `
            <button id="zxi-music-btn" style="position:absolute;top:15px;right:15px;background:rgba(255,255,255,0.05);border:1px solid rgba(0,255,204,0.3);color:#ff4444;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 8px rgba(0,0,0,0.3);transition:all 0.3s ease;z-index:10;">🔇</button>
            <h3 style="margin:0 0 6px 0;color:#00ffcc;font-size:20px;letter-spacing:1.5px;font-weight:800;text-shadow:0 0 12px rgba(0,255,204,0.5);">ZXI SYSTEM AUTH</h3>
            <p style="margin:0 0 20px 0;color:#64748b;font-size:11px;letter-spacing:2px;font-weight:600;">ENTER LICENSE KEY</p>
            <input type="text" id="zxi-key-input" placeholder="ENTER KEY HERE" style="width:100%;padding:12px;margin-bottom:16px;border:1px solid rgba(0,255,204,0.4);border-radius:8px;background:rgba(7,11,25,0.6);color:#fff;text-align:center;box-sizing:border-box;font-size:13px;font-weight:600;letter-spacing:1px;outline:none;transition:all 0.3s ease;box-shadow:inset 0 2px 4px rgba(0,0,0,0.5);">
            <button id="zxi-login-btn" style="width:100%;background:#00ffcc;color:#030712;border:none;padding:12px;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;letter-spacing:0.5px;margin-bottom:12px;box-shadow:0 4px 12px rgba(0,255,204,0.3);transition:all 0.2s ease;">VERIFY & RUN</button>
            <button id="zxi-telegram-btn" style="width:100%;background:#229ED9;color:#fff;border:none;padding:12px;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;letter-spacing:0.5px;box-shadow:0 4px 12px rgba(34,158,217,0.25);">TELEGRAM</button>
            <div id="zxi-status" style="margin-top:16px;font-size:11px;font-weight:700;color:#64748b;letter-spacing:1.5px;">READY</div>
        `;
        document.body.appendChild(modal);

        // Adjust for mobile
        setTimeout(() => {
            modal.style.zIndex = "2147483647";
            if (window.innerWidth < 600) {
                modal.style.width = "90%";
                modal.style.maxWidth = "300px";
            }
        }, 10);

        return modal;
    }

    // Setup music button
    function setupMusicButton(modal) {
        const musicBtn = document.getElementById("zxi-music-btn");
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
                } catch (e) {
                    return;
                }
            }

            if (audioPlayer.paused) {
                audioPlayer.play().then(() => {
                    musicBtn.textContent = "🔊";
                    musicBtn.style.color = "#00ffcc";
                    musicBtn.style.borderColor = "#00ffcc";
                    musicBtn.style.boxShadow = "0 0 10px rgba(0,255,204,0.4)";
                }).catch(err => {
                    console.log("Playback failed:", err);
                });
            } else {
                audioPlayer.pause();
                musicBtn.textContent = "🔇";
                musicBtn.style.color = "#ff4444";
                musicBtn.style.borderColor = "rgba(0,255,204,0.3)";
                musicBtn.style.boxShadow = "0 0 8px rgba(0,0,0,0.3)";
            }
        });
    }

    // Setup input field effects
    function setupInputField() {
        const inputField = document.getElementById("zxi-key-input");
        if (!inputField) return;

        inputField.addEventListener("focus", () => {
            inputField.style.border = "1px solid #00ffcc";
            inputField.style.boxShadow = "0 0 10px rgba(0,255,204,0.25), inset 0 2px 4px rgba(0,0,0,0.5)";
        });

        inputField.addEventListener("blur", () => {
            inputField.style.border = "1px solid rgba(0,255,204,0.4)";
            inputField.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.5)";
        });
    }

    // Setup Telegram button
    function setupTelegramButton(statusElement) {
        const telegramBtn = document.getElementById("zxi-telegram-btn");
        if (!telegramBtn) return;

        telegramBtn.addEventListener("click", async () => {
            try {
                const response = await fetch(CONFIG.telegramFile + "?t=" + Date.now());
                const url = (await response.text()).trim();
                if (url.startsWith("http")) {
                    window.open(url, "_blank");
                }
            } catch (e) {}
        });
    }

    // Show loading overlay with countdown
    async function showRedirectOverlay(redirectUrl) {
        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position:fixed; top:0; left:0; width:100%; height:100%;
            background:rgba(3,7,18,0.05); backdrop-filter:blur(1px);
            z-index:2147483647;
            display:flex; align-items:center; justify-content:center;
            font-family:system-ui,-apple-system,sans-serif;
        `;

        const countdownStart = Math.floor(Math.random() * 4) + 22; // 22-25 seconds
        let currentCount = countdownStart;
        const circumference = 597; // 2 * PI * 95 ≈ 597

        overlay.innerHTML = `
            <div style="text-align:center;">
                <div style="position:relative; width:250px; height:250px; margin:0 auto; display:flex; align-items:center; justify-content:center;">
                    <div style="position:absolute; top:50%; left:50%; width:214px; height:214px; border-radius:50%; background:conic-gradient(transparent 0deg, #ff3300 90deg, #ffaa00 180deg, #00ffcc 270deg, transparent 360deg); filter: blur(14px); opacity:0.85; animation: zxi-fire-spin 1.5s linear infinite; z-index:1;"></div>
                    <div style="position:absolute; top:50%; left:50%; width:206px; height:206px; border-radius:50%; background:conic-gradient(transparent 0deg, #ff0055 60deg, #ff5500 120deg, #ffcc00 240deg, transparent 360deg); filter: blur(6px); opacity:0.9; animation: zxi-fire-spin 1s linear infinite reverse; z-index:2;"></div>
                    <svg width="240" height="240" style="transform:rotate(-90deg); position:relative; z-index:3;">
                        <circle cx="120" cy="120" r="95" fill="rgba(6,10,23,0.65)" stroke="rgba(0,255,204,0.1)" stroke-width="14"></circle>
                        <circle id="zxi-progress" cx="120" cy="120" r="95" fill="none" stroke="#00ffcc" stroke-width="14" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" stroke-linecap="round" style="filter: drop-shadow(0 0 6px #00ffcc); transition: stroke-dashoffset 1s linear;"></circle>
                    </svg>
                    <div id="zxi-countdown-text" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:54px; font-weight:900; color:#fff; text-shadow:0 0 20px #00ffcc, 0 0 30px rgba(0,255,204,0.3); z-index:4;">${countdownStart}</div>
                </div>
                <p style="margin-top:30px; color:#00ffcc; font-size:16px; font-weight:700; letter-spacing:3px; text-shadow:0 0 12px rgba(0,255,204,0.4); position:relative; z-index:4;">REDIRECTING...</p>
            </div>
        `;
        document.body.appendChild(overlay);

        const progressCircle = overlay.querySelector("#zxi-progress");
        const countdownText = overlay.querySelector("#zxi-countdown-text");

        const interval = setInterval(() => {
            currentCount--;
            countdownText.textContent = currentCount;
            progressCircle.style.strokeDashoffset = circumference * (currentCount / countdownStart);

            if (currentCount <= 0) {
                clearInterval(interval);
                if (audioPlayer) {
                    audioPlayer.pause();
                    audioPlayer = null;
                }
                overlay.remove();
                window.location.replace(redirectUrl);
            }
        }, 1000);
    }

    // Handle successful login
    async function handleSuccessfulLogin(modal, statusElement, loginBtn, telegramBtn, inputKey) {
        statusElement.innerHTML = "<span style='color:#00ffcc;'>KEY VALIDATED! ✓</span>";
        
        setTimeout(async () => {
            modal.remove();

            // Show checking update overlay
            const updateOverlay = document.createElement("div");
            updateOverlay.style.cssText = `
                position:fixed; top:0; left:0; width:100%; height:100%;
                background:rgba(3,7,18,0.85); backdrop-filter:blur(8px);
                z-index:2147483647;
                display:flex; align-items:center; justify-content:center;
                font-family:system-ui,-apple-system,sans-serif;
            `;
            updateOverlay.innerHTML = `
                <div style="text-align:center; background:rgba(6,10,23,0.95); padding:35px 30px; border-radius:16px; border:1px solid #00ffcc; width:290px; animation: zxi-lightning-glow 3s linear infinite;">
                    <div style="width:45px; height:45px; border:4px solid rgba(0,255,204,0.1); border-top:4px solid #00ffcc; border-radius:50%; margin:0 auto 20px auto; animation: zxi-spin 0.8s linear infinite; box-shadow:0 0 15px rgba(0,255,204,0.2);"></div>
                    <p id="zxi-check-text" style="color:#00ffcc; font-size:15px; font-weight:700; margin:0; letter-spacing:1.5px; text-shadow:0 0 8px rgba(0,255,204,0.3);">CHECKING UPDATE...</p>
                </div>
            `;
            document.body.appendChild(updateOverlay);

            let updateAvailable = false;
            try {
                const updateCheck = await fetch(CONFIG.updateCheck);
                const updateData = await updateCheck.text();
                if (updateData.includes("GitHub Updated")) {
                    updateAvailable = true;
                }
            } catch (e) {}

            await new Promise(resolve => setTimeout(resolve, 5000));

            const checkText = document.getElementById("zxi-check-text");
            if (updateAvailable) {
                checkText.innerHTML = "<span style='color:#00ffcc;'>Link Updated Successfully! ✓</span>";
            } else {
                checkText.innerHTML = "<span style='color:#ff4444; text-shadow:0 0 8px rgba(255,68,68,0.3);'>No Update Available!</span>";
            }

            await new Promise(resolve => setTimeout(resolve, 1500));
            updateOverlay.remove();

            // Get redirect URL
            const redirectResponse = await fetch(CONFIG.redirectFile + "?t=" + Date.now());
            redirectURL = (await redirectResponse.text()).trim();

            if (redirectURL && redirectURL.startsWith("http")) {
                await showRedirectOverlay(redirectURL);
            }
        }, 800);
    }

    // Setup login button
    function setupLoginButton(modal, statusElement, loginBtn, telegramBtn, inputField) {
        loginBtn.addEventListener("click", async () => {
            const inputKey = inputField.value.trim();

            if (!inputKey) {
                statusElement.innerHTML = "<span style='color:#ff4444;'>PLEASE INPUT KEY!</span>";
                return;
            }

            statusElement.innerHTML = "<span style='color:#00ffcc; text-shadow:0 0 8px rgba(0,255,204,0.3);'>CONNECTING SERVER...</span>";
            loginBtn.disabled = telegramBtn.disabled = true;

            try {
                const keyResponse = await fetch(CONFIG.keyFile + "?t=" + Date.now());
                const keyData = await keyResponse.text();
                const validKeys = keyData.split("\n").map(line => line.trim()).filter(line => line !== "");

                if (validKeys.includes(inputKey)) {
                    await handleSuccessfulLogin(modal, statusElement, loginBtn, telegramBtn, inputKey);
                } else {
                    statusElement.innerHTML = "<span style='color:#ff4444;'>INVALID LICENSE KEY!</span>";
                    loginBtn.disabled = telegramBtn.disabled = false;
                }
            } catch (e) {
                statusElement.innerHTML = "<span style='color:#ff4444;'>SERVER ERROR!</span>";
                loginBtn.disabled = telegramBtn.disabled = false;
            }
        });
    }

    // Main initialization
    async function init() {
        addStyles();
        const modal = createAuthModal();
        setupMusicButton(modal);
        setupInputField();

        const statusElement = document.getElementById("zxi-status");
        const loginBtn = document.getElementById("zxi-login-btn");
        const telegramBtn = document.getElementById("zxi-telegram-btn");
        const inputField = document.getElementById("zxi-key-input");

        if (telegramBtn) setupTelegramButton(statusElement);
        if (loginBtn && inputField && statusElement) {
            setupLoginButton(modal, statusElement, loginBtn, telegramBtn, inputField);
        }
    }

    // Start the application
    init();
})();
