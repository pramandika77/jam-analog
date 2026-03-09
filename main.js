document.addEventListener('DOMContentLoaded', function() {
    // ==================== ELEMEN DOM ====================
    const hourHand = document.querySelector('.hand.hour');
    const minuteHand = document.querySelector('.hand.minute');
    const secondHand = document.querySelector('.hand.second');
    const digitalTime = document.getElementById('digital-time');
    const digitalDate = document.getElementById('digital-date');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const modeSwitch = document.querySelector('.mode-switch');
    const body = document.body;

    // ==================== FUNGSI JAM ANALOG ====================
    function updateClock() {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        // Menghitung rotasi untuk setiap jarum
        // Detik: 360° / 60 detik = 6° per detik
        const secondsDeg = (seconds / 60) * 360;
        
        // Menit: 360° / 60 menit = 6° per menit + efek dari detik
        const minutesDeg = ((minutes + seconds / 60) / 60) * 360;
        
        // Jam: 360° / 12 jam = 30° per jam + efek dari menit
        const hoursDeg = ((hours % 12 + minutes / 60 + seconds / 3600) / 12) * 360;

        // Menerapkan transformasi ke jarum jam
        if (secondHand) secondHand.style.transform = `rotate(${secondsDeg}deg)`;
        if (minuteHand) minuteHand.style.transform = `rotate(${minutesDeg}deg)`;
        if (hourHand) hourHand.style.transform = `rotate(${hoursDeg}deg)`;

        // Update tampilan digital
        updateDigitalDisplay(now);
    }

    // ==================== FUNGSI TAMPILAN DIGITAL ====================
    function updateDigitalDisplay(date) {
        if (!digitalTime || !digitalDate) return;

        // Format waktu (HH:MM:SS)
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        digitalTime.textContent = `${hours}:${minutes}:${seconds}`;

        // Format tanggal (Hari, Tanggal Bulan Tahun)
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        digitalDate.textContent = date.toLocaleDateString('id-ID', options);
    }
    // ==================== FUNGSI TEMA ====================
    function setTheme(themeName) {
        // Hapus semua theme yang mungkin aktif
        themeButtons.forEach(btn => btn.classList.remove('is-active'));
        
        // Set theme pada body
        body.setAttribute('data-theme', themeName);
        
        // Aktifkan tombol yang sesuai
        const activeButton = document.querySelector(`.theme-btn[data-theme="${themeName}"]`);
        if (activeButton) activeButton.classList.add('is-active');
        
        // Simpan preferensi theme
        localStorage.setItem('preferred-theme', themeName);
    }

    // Event listener untuk tombol theme
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
        });

        // Tambahkan keyboard accessibility
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // ==================== FUNGSI DARK MODE ====================
    function toggleDarkMode() {
        body.classList.toggle('dark');
        
        // Update teks tombol
        const isDark = body.classList.contains('dark');
        modeSwitch.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        localStorage.setItem('dark-mode', isDark);
    }

    if (modeSwitch) {
        modeSwitch.addEventListener('click', toggleDarkMode);
        modeSwitch.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDarkMode();
            }
        });
    }

    // ==================== INISIALISASI ====================
    function initializeFromLocalStorage() {
        const savedTheme = localStorage.getItem('preferred-theme');
        if (savedTheme && ['ocean', 'sunset', 'forest'].includes(savedTheme)) {
            setTheme(savedTheme);
        } else {
            setTheme('ocean'); // Default theme
        }

        const savedDarkMode = localStorage.getItem('dark-mode');
        if (savedDarkMode === 'true') {
            body.classList.add('dark');
            if (modeSwitch) modeSwitch.textContent = 'Light Mode'; 
        } else {
            if (modeSwitch) modeSwitch.textContent = 'Dark Mode';
        }
    }

    // ==================== EFEK EXTRA ====================
    // Menambahkan efek detak pada jarum detik setiap detik
    function addTickEffect() {
        if (secondHand) {
            secondHand.style.transition = 'transform 0.2s cubic-bezier(0.4, 2.5, 0.3, 1)';
        }
    }

    // Menambahkan class untuk menandai jam yang sudah berjalan
    function markCurrentHour() {
        const now = new Date();
        const currentHour = now.getHours() % 12 || 12; // Konversi ke format 12 jam
        
        // Hapus semua highlight
        document.querySelectorAll('.clock label').forEach(label => {
            label.classList.remove('current-hour');
        });

        // Highlight jam saat ini
        const currentHourLabel = document.querySelector(`.clock label:nth-child(${currentHour})`);
        if (currentHourLabel) {
            currentHourLabel.classList.add('current-hour');
        }
    }

    // ==================== ANIMASI SMOOTH UNTUK PERUBAHAN THEME ====================
    function addThemeTransition() {
        const clock = document.querySelector('.clock');
        if (clock) {
            clock.style.transition = 'border-color 0.3s ease, box-shadow 0.3s ease';
        }
    }

    // ==================== JALANKAN SEMUA FUNGSI ====================
    
    // Inisialisasi dari localStorage
    initializeFromLocalStorage();
    
    // Tambahkan efek-efek
    addTickEffect();
    addThemeTransition();
    
    // Update jam setiap detik
    updateClock(); // Panggil sekali langsung
    setInterval(updateClock, 1000);
    
    // Update highlight jam setiap menit
    // markCurrentHour();
    // setInterval(markCurrentHour, 60000);

    // ==================== GREETING BERDASARKAN WAKTU ====================

    // Fungsi untuk mendapatkan greeting dan icon
    function getGreeting(hours) {
        if (hours >= 3 && hours < 10) {
            return {
                text: "Selamat Pagi",
                icon: "🌅",
                emoji: "☀️"
            };
        } else if (hours >= 10 && hours < 15) {
            return {
                text: "Selamat Siang",
                icon: "☀️",
                emoji: "🍚"
            };
        } else if (hours >= 15 && hours < 18) {
            return {
                text: "Selamat Sore",
                icon: "🌤️",
                emoji: "☕"
            };
        } else if (hours >= 18 && hours < 21) {
            return {
                text: "Selamat Malam",
                icon: "🌙",
                emoji: "📖"
            };
        } else {
            return {
                text: "Selamat Tidur",
                icon: "💤",
                emoji: "🛌"
            };
        }
    }

    // Fungsi update greeting
    function updateGreeting() {
        const greetingElement = document.getElementById('greeting');
        const greetingText = document.getElementById('greeting-text');
        
        if (!greetingElement || !greetingText) return;
        
        const now = new Date();
        const hours = now.getHours();
        
        const greeting = getGreeting(hours);
        
        // Update teks
        greetingText.textContent = greeting.text;
        
        // Update icon dengan animasi
        const iconElement = greetingElement.querySelector('.greeting-icon');
        if (iconElement) {
            iconElement.textContent = greeting.icon;
            
            // Trigger animasi ulang
            iconElement.style.animation = 'none';
            iconElement.offsetHeight;
            iconElement.style.animation = 'wave 2s infinite';
        }
        
        // Tambah emoji kecil di belakang (opsional)
        greetingElement.setAttribute('data-emoji', greeting.emoji);
    }

    // Panggil saat pertama load
    updateGreeting();

    // Update setiap menit (biar pas jam berganti)
    setInterval(updateGreeting, 60000);

    // Atau kalau mau lebih seru, update setiap detik dengan efek
    function updateGreetingWithEffect() {
        updateGreeting();
        
        // Efek subtle saat berganti jam
        const now = new Date();
        if (now.getMinutes() === 0 && now.getSeconds() < 5) {
            const greeting = document.getElementById('greeting');
            greeting.style.transform = 'scale(1.05)';
            setTimeout(() => {
                greeting.style.transform = '';
            }, 500);
        }
    }

    // Panggil setiap detik untuk update yang lebih akurat
    setInterval(updateGreetingWithEffect, 1000);


    // ==================== QUOTE MOTIVASI ====================
    const quotes = {
        pagi: [
            "Jangan lupa olahraga!🏃‍♂️",
            "Hari ini adalah kesempatan baru!🍺",
            "Jangan lupa sarapan!🍳",
            "Awali hari dengan senyum😊"
        ],
        siang: [
            "Percaya pada dirimu sendiri!🌟",
            "Tetap semangat!💪",
            "Istirahat sejenak yuk!",
            "Minum air putih yang cukup💧"
        ],
        sore: [
            "Cerita hampir selesai😆",
            "Kerja bagus hari ini!👍",
            "Satu langkah lagi!🤩",
            "Kamu melakukan yang terbaik!✊"
        ],
        malam: [
            "Selamat beristirahat!🌙",
            "Jangan lupa bersyukur!🤲",
            "Siapkan rencana untuk besok📝",
            "Tidur yang cukup ya!🛌"
        ],
        tidur: [
            "Mimpi indah!✨",
            "Selamat tidur...💤",
            "See you tomorrow!👋",
            "Istirahat yang berkualitas🕗"
        ]
    };

    function getRandomQuote(hours) {
        let category;
        if (hours >= 3 && hours < 10) category = 'pagi';
        else if (hours >= 10 && hours < 15) category = 'siang';
        else if (hours >= 15 && hours < 18) category = 'sore';
        else if (hours >= 18 && hours < 22) category = 'malam';
        else category = 'tidur';
        
        const categoryQuotes = quotes[category];
        return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
    }

    // Tampilkan quote di element terpisah
    function updateQuote() {
        const now = new Date();
        const hours = now.getHours();
        const quote = getRandomQuote(hours);
        
        // Cari atau buat element untuk quote
        let quoteElement = document.getElementById('daily-quote');
        
        if (!quoteElement) {
            // Buat element baru kalau belum ada
            quoteElement = document.createElement('div');
            quoteElement.id = 'daily-quote';
            quoteElement.className = 'daily-quote';
            
            // Taruh setelah greeting atau di tempat yang diinginkan
            const greeting = document.getElementById('greeting');
            if (greeting && greeting.parentNode) {
                greeting.parentNode.insertBefore(quoteElement, greeting.nextSibling);
            } else {
                // Fallback: cari container atau body
                const container = document.querySelector('.container');
                if (container) container.appendChild(quoteElement);
                else document.body.appendChild(quoteElement);
            }
        }
        
        // Tampilkan quote
        quoteElement.innerHTML = `💭 ${quote}`;
    }

    // Panggil beberapa detik
    updateQuote();
    setInterval(updateQuote, 10000);
});