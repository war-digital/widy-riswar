document.addEventListener('DOMContentLoaded', () => {
    // --- Parse Guest Name from URL ---
    // Mengambil manual parameter 'to' agar simbol '&' yang tidak di-encode tetap terbaca
    let guestNameParam = null;
    const searchString = window.location.search;
    const toIndex = searchString.indexOf('to=');
    
    if (toIndex !== -1) {
        let rawTo = searchString.substring(toIndex + 3);
        try {
            guestNameParam = decodeURIComponent(rawTo.replace(/\+/g, ' '));
        } catch (e) {
            guestNameParam = rawTo.replace(/\+/g, ' ');
        }
    }
    
    const guestNameEl = document.getElementById('guestName');
    if (guestNameParam && guestNameEl) {
        guestNameEl.innerText = guestNameParam;
    }

    const openBtn = document.getElementById('openInvitation');
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('mainContent');

    // Initialize AOS Animations on load for cover content carefully to avoid mobile blocking errors
    try {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                once: false, 
                mirror: true, 
                offset: 50, 
                anchorPlacement: 'top-bottom', 
            });
        }
    } catch (e) {
        console.error("AOS initialization failed:", e);
    }

    openBtn.addEventListener('click', () => {
        // Play music
        initAudio();

        // Slide up the cover
        cover.classList.add('slide-up');
        
        // Show main content
        setTimeout(() => {
            mainContent.classList.remove('hidden');
            cover.style.display = 'none'; // Completely hide after transition
            
            // Allow scrolling on body
            document.body.style.overflowY = 'auto';
            
            // Refresh AOS to calculate newly visible elements safely
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
            
            // Optional: Play audio here if added later
        }, 1000); // Wait for transition to finish
    });

    // Disable scrolling while on cover
    document.body.style.overflowY = 'hidden';

    // Interactive UI Morph Scroll Effect
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Morph background blobs organically based on scroll positioning (keeping UI morph active without breaking photo arches)
        document.querySelectorAll('.morph-blob').forEach((blob, idx) => {
            const val1 = 30 + Math.sin((scrolled + idx * 200) * 0.003) * 45;
            const val2 = 30 + Math.cos((scrolled + idx * 200) * 0.004) * 40;
            const val3 = 30 + Math.sin((scrolled + idx * 200) * 0.005 + 2) * 45;
            const val4 = 30 + Math.cos((scrolled + idx * 200) * 0.003 + 2) * 40;
            
            const morphStr = `${val1}% ${val2}% ${val3}% ${val4}% / ${val4}% ${val3}% ${val2}% ${val1}%`;
            
            blob.style.borderRadius = morphStr;
            blob.style.transition = 'border-radius 0.3s ease-out';
        });
    });

    // --- Countdown Timer Logic ---
    const targetDate = new Date("May 23, 2026 09:00:00").getTime();
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            const container = document.querySelector('.countdown-container');
            if(container) container.innerHTML = "<p class='invite-subtitle' style='margin-top:20px; font-weight:bold;'>Hari Bahagia Telah Tiba!</p>";
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const elDays = document.getElementById("days");
        const elHours = document.getElementById("hours");
        const elMinutes = document.getElementById("minutes");
        const elSeconds = document.getElementById("seconds");
        
        if(elDays) elDays.innerText = days < 10 ? "0" + days : days;
        if(elHours) elHours.innerText = hours < 10 ? "0" + hours : hours;
        if(elMinutes) elMinutes.innerText = minutes < 10 ? "0" + minutes : minutes;
        if(elSeconds) elSeconds.innerText = seconds < 10 ? "0" + seconds : seconds;
    }
    
    // Mulai Interval
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Jalankan instan untuk menghindari delay kosong

    // --- Audio implementation ---
    let isAudioInitialized = false;
    const bgMusic = document.getElementById('bg-music');
    const coverBg = document.querySelector('.cover-bg');

    function initAudio() {
        // Jika UI belum dimodifikasi, jalankan animasi detak dan sembunyikan petunjuk
        if (!isAudioInitialized) {
            isAudioInitialized = true;

            const musicHint = document.getElementById('music-hint');
            if (musicHint) musicHint.style.opacity = '0';
            if (musicHint) setTimeout(() => musicHint.style.display = 'none', 500);

            // Tambahkan simulasi getaran
            const coverBg = document.querySelector('.cover-bg');
            const coverImg = document.querySelector('.cover-mempelai-img');
            const coverContent = document.querySelector('.cover-content');
            const coverBtn = document.querySelector('#openInvitation');

            if (coverBg) coverBg.classList.add('simulated-beat-bg');
            if (coverImg) coverImg.classList.add('simulated-beat-img');
            if (coverContent) coverContent.classList.add('simulated-beat-content');
            if (coverBtn) coverBtn.classList.add('simulated-beat-btn');
            
            document.body.classList.add('playing-music');
        }

        // Selalu coba memutar musik jika sedang terjeda/ditahan browser
        if (bgMusic && bgMusic.paused) {
            bgMusic.play().catch(e => console.log('Autoplay ditahan browser, coba lagi:', e));
        }
    }

    // Interaksi tap pertama kali pada layar
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });

    // --- Wishes Form Logic ---
    const wishesForm = document.getElementById('wishesForm');
    const wishesList = document.getElementById('wishesList');
    // Web App URL dari pengguna
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyI3tihTwv7q9bfig4J5tn-U6AWU-NRKiwWtwCZ_JWUayWo_ElhzuafwcAyBgnRTAmAFA/exec';

    // Mencegah XSS basic
    function escapeHtml(unsafe) {
        return (unsafe || '').toString()
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    async function loadWishes() {
        if (!wishesList) return;
        
        wishesList.innerHTML = '<div style="text-align: center; padding: 20px; font-style: italic; color: #555;">Memuat pesan tamu...</div>';
        
        try {
            const response = await fetch(SCRIPT_URL);
            let wishesData = await response.json();
            
            wishesList.innerHTML = '';
            
            // Jika data dari Google Sheets kosong, tampilkan pesan default
            if (!wishesData || wishesData.length === 0) {
                wishesData = [
                    { name: "Keluarga Besar Bpk. Sudirman", message: "Selamat menempuh hidup baru Widy & Riswar. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.", time: new Date().toISOString() }
                ];
            }
            
            // Pisahkan pesan utama dan balasannya
            const parents = wishesData.filter(w => !w.replyTo);
            const replies = wishesData.filter(w => w.replyTo);
            
            // Kelompokkan balasan berdasarkan ID induk (time)
            const repliesMap = {};
            replies.forEach(r => {
                if(!repliesMap[r.replyTo]) repliesMap[r.replyTo] = [];
                repliesMap[r.replyTo].push(r);
            });
            
            // Tampilkan dari pesan yang paling baru di atas
            [...parents].reverse().forEach(wish => {
                const date = new Date(wish.time);
                let timeString = '';
                if (!isNaN(date.getTime())) {
                    timeString = date.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                }
                
                // Susun HTML untuk balasan-balasannya
                let repliesHtml = '';
                if(repliesMap[wish.time]) {
                     repliesMap[wish.time].forEach(r => {
                          const rDate = new Date(r.time);
                          let rTimeString = !isNaN(rDate.getTime()) ? rDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
                          repliesHtml += `
                              <div class="reply-item">
                                  <div class="wish-name" style="font-size:0.85rem;">${escapeHtml(r.name)}</div>
                                  <span class="wish-time">${rTimeString}</span>
                                  <div class="wish-text" style="font-size:0.85rem;">${escapeHtml(r.message)}</div>
                              </div>
                          `;
                     });
                }
                
                // Timestamp atau ID raw digunakan untuk referensi balasan
                const safeId = wish.time; 
                
                const wishHtml = `
                    <div class="wish-item">
                        <div class="wish-name">${escapeHtml(wish.name)}</div>
                        <span class="wish-time">${timeString}</span>
                        <div class="wish-text">${escapeHtml(wish.message)}</div>
                        
                        <button class="reply-btn" onclick="toggleReplyForm('${safeId}')">Balas Pesan</button>
                        
                        <div class="replies-container">
                             ${repliesHtml}
                             
                             <div class="reply-form-container" id="reply-form-${safeId}">
                                 <input type="text" class="reply-input" id="reply-name-${safeId}" placeholder="Nama Anda" required>
                                 <textarea class="reply-textarea" id="reply-message-${safeId}" placeholder="Tulis balasan..." rows="2" required></textarea>
                                 <button class="reply-submit-btn" onclick="submitReply('${safeId}')">Kirim Balasan</button>
                             </div>
                        </div>
                    </div>
                `;
                wishesList.innerHTML += wishHtml;
            });
        } catch (error) {
            console.error('Terjadi kesalahan saat memuat pesan:', error);
            wishesList.innerHTML = '<div style="text-align: center; padding: 20px; color: #800020;">Gagal memuat pesan. Pastikan Anda terkoneksi dengan internet.</div>';
        }
    }

    // Fungsi global untuk membuka dan mengirim balasan
    window.toggleReplyForm = function(id) {
        const form = document.getElementById(`reply-form-${id}`);
        if(form) form.classList.toggle('active');
    };

    window.submitReply = async function(parentId) {
        const nameInput = document.getElementById(`reply-name-${parentId}`).value;
        const messageInput = document.getElementById(`reply-message-${parentId}`).value;
        const btn = document.querySelector(`#reply-form-${parentId} .reply-submit-btn`);
        
        if(!nameInput.trim() || !messageInput.trim()) {
            alert('Silakan isi nama dan pesan balasan terlebih dahulu.');
            return;
        }
        
        btn.innerText = 'Mengirim...';
        btn.disabled = true;
        btn.style.opacity = '0.6';
        
        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ name: nameInput, message: messageInput, replyTo: parentId }),
                headers: { 'Content-Type': 'text/plain;charset=utf-8' }
            });
            await loadWishes();
        } catch(error) {
            console.error('Gagal membalas pesan:', error);
            alert('Gagal mengirim balasan, silakan periksa koneksi internet Anda.');
            btn.innerText = 'Kirim Balasan';
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    };

    if (wishesForm) {
        loadWishes();
        
        wishesForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('wishName').value;
            const messageInput = document.getElementById('wishMessage').value;
            const submitBtn = wishesForm.querySelector('button');
            
            if (!nameInput.trim() || !messageInput.trim()) return;
            
            submitBtn.innerText = 'Mengirim...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            try {
                // Mengirim data ke Google Sheets
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify({ name: nameInput, message: messageInput }),
                    // Menggunakan text/plain agar tidak terblokir peraturan CORS di browser
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' }
                });
                
                // Reset kolom pengisian
                wishesForm.reset();
                
                // Tampilkan pesan baru yang baru saja masuk (memuat ulang daftar)
                await loadWishes();
                
                // Otomatis geser/scroll daftar pesan ke paling atas
                const container = document.querySelector('.wishes-list-container');
                if (container) container.scrollTop = 0;
            } catch (error) {
                console.error('Terjadi kesalahan saat mengirim pesan:', error);
                alert('Gagal mengirim pesan. Silakan periksa koneksi internet Anda dan coba lagi.');
            } finally {
                // Kembalikan status tombol seperti semula
                submitBtn.innerText = 'Kirim Pesan';
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        });
    }

});
