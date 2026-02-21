/* --- 1. SETUP MUSIK --- */
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
let isMusicPlaying = false;

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.innerText = '🎵 Play';
    } else {
        bgMusic.play().catch(e => console.log("Autoplay diblokir browser, butuh interaksi user", e));
        musicToggle.innerText = '🎵 Mute';
    }
    isMusicPlaying = !isMusicPlaying;
}
musicToggle.addEventListener('click', toggleMusic);

/* --- 2. LOGIKA AMPLOP & CONFETTI --- */
const envelope = document.getElementById('envelope');

function shootConfetti() {
    const colors = ['#ffb3c6', '#fb6f92', '#ffccd5', '#ffffff', '#ffd6a5'];
    for(let i = 0; i < 40; i++) {
        let conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.animationDuration = (Math.random() * 2 + 2) + 's';
        document.body.appendChild(conf);
        
        setTimeout(() => conf.remove(), 4000);
    }
}

envelope.addEventListener('click', () => {
    if(!envelope.classList.contains('open')) {
        envelope.classList.add('open');
        shootConfetti();
        
        // Auto play musik saat amplop diklik pertama kali
        if(!isMusicPlaying) toggleMusic();

        // Auto scroll ke Kartu setelah 2 detik
        setTimeout(() => {
            document.getElementById('sec-card').scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    }
});

/* --- 3. LOGIKA FADE-IN & TYPING EFFECT --- */
const textToType = "Halo sayang... Selamat ulang tahun ya! Terima kasih udah jadi alasan senyumku setiap hari. Semoga hari ini penuh dengan kebahagiaan buat kamu. Scroll ke bawah ya, ada sesuatu buat kamu! 💕";
let i = 0;
let isTypingStarted = false;

function typeWriter() {
    if (i < textToType.length) {
        document.getElementById("typewriter").innerHTML += textToType.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
    }
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Mulai ngetik jika section kartu terlihat
            if(entry.target.id === 'sec-card' && !isTypingStarted) {
                isTypingStarted = true;
                setTimeout(typeWriter, 500); 
            }
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('section').forEach(sec => {
    observer.observe(sec);
});

/* --- 4. LOGIKA LIGHTBOX GALERI --- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

function openLightbox(element) {
    const img = element.querySelector('img').src;
    const text = element.querySelector('p').innerText;
    lightboxImg.src = img;
    lightboxCaption.innerText = text;
    lightbox.classList.add('active');
}

function closeLightbox() {
    lightbox.classList.remove('active');
}

/* --- 5. LOGIKA MINI GAME BALON --- */
const gameArea = document.getElementById('gameArea');
const wordDisplay = document.getElementById('wordDisplay');
const startGameBtn = document.getElementById('startGameBtn');
const winModal = document.getElementById('winModal');

const targetWord = "HAPPY"; // Disingkat jadi 5 huruf agar tidak terlalu lama
let collectedLetters = 0;
let gameInterval;

startGameBtn.addEventListener('click', () => {
    startGameBtn.style.display = 'none';
    collectedLetters = 0;
    wordDisplay.innerText = "_ ".repeat(targetWord.length);
    spawnBalloons();
});

function spawnBalloons() {
    gameInterval = setInterval(() => {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = Math.random() * 80 + '%';
        
        const bColors = ['#ffb3c6', '#fb6f92', '#83c5be', '#a2d2ff'];
        balloon.style.backgroundColor = bColors[Math.floor(Math.random() * bColors.length)];
        
        gameArea.appendChild(balloon);

        const popEvent = ('ontouchstart' in window) ? 'touchstart' : 'mousedown';
        
        balloon.addEventListener(popEvent, function(e) {
            e.preventDefault(); 
            this.style.transform = 'scale(1.5)';
            this.style.opacity = '0';
            
            if(collectedLetters < targetWord.length) {
                collectedLetters++;
                let currentText = targetWord.substring(0, collectedLetters);
                let remaining = " _".repeat(targetWord.length - collectedLetters);
                wordDisplay.innerText = currentText.split('').join(' ') + remaining;
                
                if(collectedLetters === targetWord.length) {
                    clearInterval(gameInterval);
                    setTimeout(() => {
                        shootConfetti(); 
                        winModal.classList.add('active');
                    }, 500);
                }
            }
            
            setTimeout(() => this.remove(), 200);
        });

        setTimeout(() => {
            if(balloon.parentElement) balloon.remove();
        }, 4000);

    }, 800); 
}