(function() {
    // --- KONFIGURASI PENTING ---
    const CONFIG = {
        apiUrl: "https://aichat.verdoank.workers.dev/", 
        title: "AI Chat", 
        primaryColor: "#0084ff",
        welcomeMessage: "Ada pertanyaan? Saya punya jawabannya",
        watermarkText: "Powered by VERDOANK",
        watermarkLink: "https://github.com/verdoanks",
        brandingId: "VERDOANK_CHAT_V1"
    };
    
    // --- 1. INJECT CSS (DIUBAH UNTUK RESPONSIVITAS) ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* ... SISA CSS (TIDAK BERUBAH) ... */
        #v-widget-container { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            position: fixed;
            bottom: 0;
            right: 0;
            z-index: 99999;
            pointer-events: none;
        }
        #v-fab {
            position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px;
            background-color: ${CONFIG.primaryColor}; border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2); 
            cursor: none;
            z-index: 99999;
            display: flex; align-items: center; justify-content: center;
            transition: transform 0.3s;
            pointer-events: auto;
        }
        #v-fab:hover { transform: scale(1.1); }
        #v-fab svg { width: 30px; height: 30px; fill: white; }
        #v-box {
            position: fixed; bottom: 90px; right: 20px;
            width: 380px; height: 550px; background: #fff;
            border-radius: 16px; box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            z-index: 99999; flex-direction: column; overflow: hidden;
            border: 1px solid #e0e0e0;
            display: flex;
            opacity: 0;
            pointer-events: none;
            transform: scale(0.9) translateY(20px);
            transition: all 0.3s ease-out;
        }
        #v-box.v-opened {
            opacity: 1;
            pointer-events: auto;
            transform: scale(1) translateY(0);
        }
        .v-header { background: #ffffff; color: #050505; padding: 15px; display: flex; justify-content: space-between; align-items: center; font-weight: bold; border-bottom: 1px solid #eee; }
        .v-close { 
            cursor: pointer;
            font-size: 1.2rem;
            background: none;
            border: none;
            color: #333; 
            padding: 0;
            width: 30px; 
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s;
        }
        .v-close:hover {
            background-color: #f0f0f0; 
        }
        #v-messages { flex: 1; padding: 15px; overflow-y: auto; background: #f9f9f9; display: flex; flex-direction: column; gap: 10px; }
        .v-msg { max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 0.9rem; line-height: 1.4; word-wrap: break-word; }
        .v-msg.ai { background: white; align-self: flex-start; border: 1px solid #ddd; color: #333; border-bottom-left-radius: 2px; }
        .v-msg.user { background: ${CONFIG.primaryColor}; align-self: flex-end; color: white; border-bottom-right-radius: 2px; }
        
        /* --- PERUBAHAN CSS UNTUK INPUT DAN TOMBOL --- */
        .v-input-area { padding: 10px; border-top: 1px solid #eee; background: white; display: flex; align-items: center; } /* Hapus gap: 8px */

        #v-input-wrapper { /* Wrapper baru untuk menahan tombol */
            flex: 1; 
            position: relative;
        }

        .v-input-area input { 
            width: 100%; 
            padding: 10px 52px 10px 15px; /* Padding Kanan DIUBAH menjadi 52px (40px tombol + 12px jarak) */
            border: 1px solid #ddd; 
            border-radius: 999px; /* Input setengah lingkaran/pill shape */
            outline: none; 
            cursor: text;
        }
        .v-input-area input:disabled { background: #eee; cursor: not-allowed; }
        
        #v-send-btn { 
            /* Posisi Absolute agar berada di dalam input */
            position: absolute; 
            right: 8px; /* Jarak DIUBAH menjadi 8px dari sisi kanan wrapper */
            top: 50%; 
            transform: translateY(-50%); 
            z-index: 10;
            
            /* Gaya Tombol (Tetap Lingkaran) */
            background: ${CONFIG.primaryColor}; 
            border: none; 
            cursor: pointer; /* Ubah kembali cursor: none menjadi cursor: pointer */
            width: 40px; 
            height: 40px;
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.2s;
        }
        /* --- AKHIR PERUBAHAN CSS --- */

        #v-send-btn:hover {
            opacity: 0.9;
            transform: translateY(-50%) scale(1.05); /* Pertahankan translateY(-50%) */
        }
        #v-send-btn:active {
            transform: translateY(-50%) scale(0.9); /* Pertahankan translateY(-50%) */
        }
        #v-send-btn svg { width: 20px; height: 20px; fill: white; margin-left: 2px; }
        pre { background: #2d2d2d; color: #fff; padding: 8px; border-radius: 6px; overflow-x: auto; margin: 5px 0; font-size: 0.8rem; }
        #v-wm { text-align: center; font-size: 11px; padding: 4px; background: white; color: #888; border-top: 1px solid #eee; }
        #v-wm a { 
            text-decoration: none; color: #888; font-weight: bold; transition: color 0.2s;
            cursor: pointer; /* Ubah kembali cursor: none menjadi cursor: pointer */
        }
        #v-wm a:hover { color: ${CONFIG.primaryColor}; }
        @media (max-width: 480px) {
            #v-box { 
                width: 100%; height: 100%; bottom: 0; right: 0; border-radius: 0; 
                transform: translateX(100%);
            }
            #v-box.v-opened {
                transform: translateX(0);
                opacity: 1;
            }
            #v-box.v-opened ~ #v-fab {
                 display: none !important; 
                 pointer-events: none;
            }
            #v-fab {
                display: flex;
            }
            .v-input-area {
                 padding-bottom: max(10px, env(safe-area-inset-bottom));
            }
        }
    `;
    document.head.appendChild(style);

    // --- 2. INJECT HTML (DIUBAH) ---
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'v-widget-container';
    widgetContainer.innerHTML = `
        <div id="v-box">
            <div class="v-header">
                <span>${CONFIG.title}</span>
                <button class="v-close">✕</button>
            </div>
            <div id="v-messages">
                <div class="v-msg ai">${CONFIG.welcomeMessage}</div>
            </div>
            <div class="v-input-area">
                <!-- Wrapper baru untuk menampung input dan tombol -->
                <div id="v-input-wrapper">
                    <input type="text" id="v-input" placeholder="Ketik pesan..." autocomplete="off">
                    <button class="v-btn" id="v-send-btn">
                        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                    </button>
                </div>
            </div>
            
            <div id="v-wm">
                <a href="${CONFIG.watermarkLink}" target="_blank">${CONFIG.watermarkText}</a>
            </div>
        </div>
        
        <div id="v-fab">
            <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>
        </div>
    `;
    document.body.appendChild(widgetContainer);

    // --- 3. LOGIC (MENGIRIM SEMUA DATA WATERMARK) ---
    let messagesHistory = [{ 
        role: "system", 
        content: `You are ${CONFIG.title}, a helpful and friendly AI assistant speaking Indonesian. Always reply in Indonesian.` 
    }];
    let isChatOpen = false;
    
    // DOM Elements
    const fab = document.getElementById('v-fab');
    const box = document.getElementById('v-box');
    const closeBtn = document.querySelector('.v-close');
    const messagesDiv = document.getElementById('v-messages');
    const input = document.getElementById('v-input');
    const sendBtn = document.getElementById('v-send-btn');
    
    // --- FUNGSIONALITAS DASAR CHAT ---

    function toggleChat() {
        isChatOpen = !isChatOpen;
        if (isChatOpen) {
            box.classList.add('v-opened');
            input.focus(); 
            scrollToBottom(); 
        } else {
            box.classList.remove('v-opened');
        }
    }

    fab.onclick = toggleChat;
    closeBtn.onclick = toggleChat;
    
    function scrollToBottom() { messagesDiv.scrollTop = messagesDiv.scrollHeight; }

    function appendMessage(role, text) { 
        const div = document.createElement('div');
        div.className = `v-msg ${role}`;
        let content = text.replace(/&/g, "&amp;").replace(/</g, "&lt;")
                           .replace(/>/g, "&gt;").replace(/\n/g, '<br>');
        if (content.includes("```")) content = content.replace(/```([\s\S]*?)```/g, (match, code) => `<pre>${code.trim()}</pre>`);
        div.innerHTML = content;
        messagesDiv.appendChild(div);
        scrollToBottom();
    }

    async function sendMessage() {
        if (input.disabled || sendBtn.disabled) {
             return;
        }

        const text = input.value.trim();
        if (!text) return; 

        appendMessage('user', text); 
        
        input.value = '';
        messagesHistory.push({ role: "user", content: text }); 
        input.disabled = true;
        sendBtn.disabled = true;

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'v-msg ai';
        loadingDiv.id = 'v-loading';
        loadingDiv.innerHTML = 'Sedang mengetik...';
        messagesDiv.appendChild(loadingDiv);
        scrollToBottom();

        // Gabungkan messagesHistory dengan semua data branding
        const payload = {
            messages: messagesHistory,
            // *** MENGIRIM SEMUA DATA BRANDING UNTUK VERIFIKASI SISI WORKER ***
            brandingId: CONFIG.brandingId,
            watermarkText: CONFIG.watermarkText,
            watermarkLink: CONFIG.watermarkLink
        };

        try {
            const res = await fetch(CONFIG.apiUrl, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            
            if (!res.ok) {
                 const errorData = await res.json().catch(() => ({ error: `Server Error: Status ${res.status}` }));
                 if(document.getElementById('v-loading')) document.getElementById('v-loading').remove();
                 
                 let errorMessage = errorData.error || `Status ${res.status}`;
                 // Cek pesan error dari Worker jika proteksi gagal
                 if (errorMessage.includes("Branding Verification Failed")) {
                     errorMessage = "Verifikasi Watermark Gagal. Watermark telah dimanipulasi. Silakan muat ulang halaman.";
                 }

                 appendMessage('ai', `Gangguan Server: ${errorMessage}`);
                 messagesHistory.pop();
                 return;
            }

            const data = await res.json();
            let reply = "";
            if (data.response && typeof data.response === 'string') reply = data.response;
            else if (data.result && data.result.response) reply = data.result.response;
            else reply = JSON.stringify(data);
            
            if(document.getElementById('v-loading')) document.getElementById('v-loading').remove();
            appendMessage('ai', reply);
            messagesHistory.push({ role: "assistant", content: reply });
        } catch (e) {
            if(document.getElementById('v-loading')) document.getElementById('v-loading').remove();
            appendMessage('ai', "Gangguan koneksi/jaringan.");
            messagesHistory.pop();
        } finally {
             input.disabled = false;
             sendBtn.disabled = false;
             input.focus();
        }
    }

    sendBtn.onclick = sendMessage;
    input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
    
})();
