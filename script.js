document.addEventListener('DOMContentLoaded', () => {
    // --- Parse Guest Name from URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const guestNameParam = urlParams.get('to');
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
        if (isAudioInitialized) return;
        isAudioInitialized = true;

        // Hilangkan petunjuk musik jika ada
        const musicHint = document.getElementById('music-hint');
        if (musicHint) musicHint.style.opacity = '0';
        if (musicHint) setTimeout(() => musicHint.style.display = 'none', 500);

        // Tambahkan simulasi getaran ke semua elemen di cover secara terpisah agar rapi
        const coverBg = document.querySelector('.cover-bg');
        const coverImg = document.querySelector('.cover-mempelai-img');
        const coverContent = document.querySelector('.cover-content');
        const coverBtn = document.querySelector('#openInvitation');

        if (coverBg) coverBg.classList.add('simulated-beat-bg');
        if (coverImg) coverImg.classList.add('simulated-beat-img');
        if (coverContent) coverContent.classList.add('simulated-beat-content');
        if (coverBtn) coverBtn.classList.add('simulated-beat-btn');
        
        document.body.classList.add('playing-music'); // Trigger animasi denyut global untuk tubuh undangan
        
        // Langsung putar audio secara normal (tanpa manipulasi yang bikin suara hilang di file lokal)
        if (bgMusic) {
            bgMusic.play().catch(e => console.log('Autoplay ditahan browser:', e));
        }
    }

    // Interaksi tap pertama kali pada layar
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });

    // --- Wishes Form Logic ---
    const wishesForm = document.getElementById('wishesForm');
    const wishesList = document.getElementById('wishesList');

    // Mencegah XSS basic
    function escapeHtml(unsafe) {
        return (unsafe || '').toString()
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    function loadWishes() {
        if (!wishesList) return;
        
        const storedWishes = localStorage.getItem('weddingWishes_WidyRiswar');
        // Data default agar terlihat tidak kosong
        const defaultWishes = [
            { name: "Keluarga Besar Bpk. Sudirman", message: "Selamat menempuh hidup baru Widy & Riswar. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.", time: new Date().toISOString() }
        ];
        
        let wishes = storedWishes ? JSON.parse(storedWishes) : defaultWishes;
        
        wishesList.innerHTML = '';
        
        // Tampilkan dari pesan yang paling baru di atas
        [...wishes].reverse().forEach(wish => {
            const date = new Date(wish.time);
            const timeString = date.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            
            const wishHtml = `
                <div class="wish-item">
                    <div class="wish-name">${escapeHtml(wish.name)}</div>
                    <span class="wish-time">${timeString}</span>
                    <div class="wish-text">${escapeHtml(wish.message)}</div>
                </div>
            `;
            wishesList.innerHTML += wishHtml;
        });
    }

    if (wishesForm) {
        loadWishes();
        
        wishesForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('wishName').value;
            const messageInput = document.getElementById('wishMessage').value;
            
            if (!nameInput.trim() || !messageInput.trim()) return;
            
            wishesForm.querySelector('button').innerText = 'Mengirim...';
            
            // Simulasi delay seolah mengirim ke server
            setTimeout(() => {
                const storedWishes = localStorage.getItem('weddingWishes_WidyRiswar');
                let wishes = storedWishes ? JSON.parse(storedWishes) : [
                    { name: "Keluarga Besar Bpk. Sudirman", message: "Selamat menempuh hidup baru Widy & Riswar. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.", time: new Date().toISOString() }
                ];
                
                wishes.push({
                    name: nameInput,
                    message: messageInput,
                    time: new Date().toISOString()
                });
                
                localStorage.setItem('weddingWishes_WidyRiswar', JSON.stringify(wishes));
                
                // Reset form
                wishesForm.reset();
                wishesForm.querySelector('button').innerText = 'Kirim Pesan';
                
                // Reload list
                loadWishes();
                
                // Scroll list ke atas untuk tunjukkan pesan baru
                const container = document.querySelector('.wishes-list-container');
                if (container) container.scrollTop = 0;
            }, 600);
        });
    }

});
