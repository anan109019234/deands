document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const introScreen = document.getElementById('intro-screen');
    const launchBtn = document.getElementById('launch-terminal-btn');
    const mainPortfolio = document.getElementById('main-portfolio');
    const mainLogoReturn = document.getElementById('main-logo-return'); // Logo untuk kembali ke intro

    // Dapatkan semua tombol 'x' untuk menutup jendela
    const closeButtons = document.querySelectorAll('.window-controls .ctrl:last-child'); // 'x' adalah anak terakhir

    const cvTerminalOutput = document.getElementById('cv-terminal-output');
    const gamesTerminalOutput = document.getElementById('games-terminal-output');
    const gamesTerminalInput = document.getElementById('games-terminal-input');
    const chatbotTerminalOutput = document.getElementById('chatbot-terminal-output');
    const chatbotTerminalInput = document.getElementById('chatbot-terminal-input');

    // Tambahkan referensi ke elemen terminal dan logo untuk animasi
    const cvTerminal = document.querySelector('.cv-terminal');
    const gamesTerminal = document.querySelector('.games-terminal');
    const chatbotTerminal = document.querySelector('.chatbot-terminal');
    const logoBottom = document.querySelector('.logo-bottom');

    // Kumpulan semua jendela di portfolio untuk inisialisasi dan reset
    const portfolioWindows = [cvTerminal, gamesTerminal, chatbotTerminal, logoBottom];

    // === Matrix Canvas Elements ===
    const matrixCanvasLeft = document.getElementById('matrix-left');
    const matrixCtxLeft = matrixCanvasLeft.getContext('2d');
    const matrixCanvasRight = document.getElementById('matrix-right');
    const matrixCtxRight = matrixCanvasRight.getContext('2d');

    // Elemen jumpscare GIF dan audio
    const jumpscareGif = document.getElementById('jumpscare-gif');
    const jumpscareAudio = document.getElementById('jumpscare-audio');

    const grudgeSound = document.getElementById('grudge-sound');

    let matrixAnimationIdLeft = null;
    let matrixAnimationIdRight = null;

    // === State Variables ===
    let gamesCurrentState = 'menu'; // 'menu', 'flappybird', 'snake'
    let chatbotCurrentState = 'start'; // 'start', 'asking'

    let flappyBirdGameInterval;
    let snakeGameInterval;

    let cvTyped = false; // Memindahkan ini ke atas agar scope-nya global

    // --- KODE UNTUK PERGANTIAN LOGO DIMULAI DI SINI ---
const logo = document.getElementById('main-logo-return');
    const logo1 = 'assets/p1.png';
    const logo2 = 'assets/p2.png';

    let currentLogo = logo1; // Pastikan logo awal adalah p1.png

    // Gunakan setTimeout untuk jeda awal (saat ini 30 detik) sebelum pergantian pertama
    setTimeout(() => {
        // Lakukan pergantian gambar pertama kali
        if (currentLogo === logo1) {
            logo.src = logo2;
            currentLogo = logo2;
            // --- BARU: Putar suara grudge saat p2.png tampil pertama kali ---
            if (grudgeSound) { // Pastikan elemen grudgeSound ditemukan
                grudgeSound.currentTime = 0; // Reset audio ke awal
                grudgeSound.play().catch(error => { console.error("Gagal memutar grudge sound (swap pertama):", error); });
            }
        } else {
            // Ini akan mengeksekusi jika currentLogo entah bagaimana sudah logo2
            logo.src = logo1;
            currentLogo = logo1;
        }

        // Kemudian, setelah pergantian pertama, mulai loop setiap 10 detik
        setInterval(() => {
            if (currentLogo === logo1) {
                logo.src = logo2;
                currentLogo = logo2;
                // --- BARU: Putar suara grudge setiap kali p2.png tampil dalam loop ---
                if (grudgeSound) { // Pastikan elemen grudgeSound ditemukan
                    grudgeSound.currentTime = 0; // Reset audio ke awal agar bisa diputar lagi
                    grudgeSound.play().catch(error => { console.error("Gagal memutar grudge sound (loop):", error); });
                }
            } else {
                logo.src = logo1;
                currentLogo = logo1;
            }
        }, 13000); // Loop setiap 10 detik (10000 milidetik)

    }, 10000); // Jeda awal 30 detik (30000 milidetik) sebelum swap pertama terjadi

    // --- Fungsi Matrix Effect ---
    function initializeMatrixEffect(canvas, ctx) {
        // Mendapatkan lebar dan tinggi kanvas
        canvas.width = canvas.offsetWidth;
        canvas.height = window.innerHeight;

        // Karakter Matrix (katakana, angka, dll.)
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
        const fontSize = 18; // Ukuran font karakter
        const columns = canvas.width / fontSize; // Hitung jumlah kolom

        // Array untuk menyimpan posisi Y setiap tetesan di setiap kolom
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1; // Mulai dari baris pertama
        }

        // Pastikan animasi sebelumnya dihentikan jika ada
        let currentAnimationId = canvas.dataset.animationId ? parseInt(canvas.dataset.animationId) : null;
        if (currentAnimationId) {
            clearInterval(currentAnimationId);
        }

        function drawMatrix() {
            // Background hitam transparan untuk efek "fade"
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Warna teks hijau terminal
            ctx.fillStyle = '#859F3D';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Mengirim tetesan kembali ke atas setelah mencapai bagian bawah
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        }

        // Jalankan animasi
        const newAnimationId = setInterval(drawMatrix, 50); // Kecepatan animasi
        canvas.dataset.animationId = newAnimationId; // Simpan ID animasi di dataset canvas
        return newAnimationId;
    }

    // --- Fungsi untuk Menghentikan Animasi Matrix ---
    function stopMatrixAnimation(animationId) {
        if (animationId) {
            clearInterval(animationId);
        }
    }

    // --- Inisialisasi Tampilan Awal ---
    // Pastikan intro screen terlihat di awal
    introScreen.style.display = 'flex';
    introScreen.classList.add('slide-down-from-top'); // Pastikan intro screen dalam kondisi 'masuk'

    // Pastikan portfolio tersembunyi sepenuhnya di awal
    mainPortfolio.style.display = 'none';
    mainPortfolio.classList.add('slide-up-to-top'); // Untuk memastikan ia tersembunyi dari atas secara default jika belum dimuat

    // Set initial state for individual portfolio windows (off-screen and transparent)
    portfolioWindows.forEach(windowEl => {
        windowEl.classList.add('initial-state');
    });

    // Inisialisasi Matrix Effect saat halaman dimuat
    matrixAnimationIdLeft = initializeMatrixEffect(matrixCanvasLeft, matrixCtxLeft);
    matrixAnimationIdRight = initializeMatrixEffect(matrixCanvasRight, matrixCtxRight);


    // --- Fungsi untuk Transisi Halaman ---
    async function showPortfolio() {
        // Hentikan animasi Matrix saat beralih ke portfolio
        stopMatrixAnimation(matrixAnimationIdLeft);
        stopMatrixAnimation(matrixAnimationIdRight);

        // Hapus kelas 'fade-in' dari elemen intro
        // Ini agar jika kembali ke intro, fade-in bisa terpicu lagi
        document.querySelectorAll('.intro-content, .intro-photo, .intro-heading, .ascii-art-intro, .launch-btn, .copyright-text')
            .forEach(el => el.classList.remove('fade-in'));

        // Mulai animasi fade-out untuk intro screen (geser ke atas)
        introScreen.classList.remove('slide-down-from-top');
        introScreen.classList.add('fade-out'); // Ini juga mengatur translateY(-100vh)

        // Tunggu transisi intro screen selesai
        // Gunakan Promise.race untuk mengatasi jika transitionend tidak terpicu
        await Promise.race([
            new Promise(resolve => {
                introScreen.addEventListener('transitionend', function handler() {
                    introScreen.removeEventListener('transitionend', handler);
                    resolve();
                }, { once: true });
            }),
            new Promise(resolve => setTimeout(resolve, 800)) // Fallback (sedikit lebih lama dari durasi CSS)
        ]);

        introScreen.style.display = 'none'; // Sembunyikan sepenuhnya setelah transisi
        introScreen.classList.remove('fade-out'); // Hapus kelas fade-out setelah selesai


        // Reset semua kelas slide-out jika ada dari kali sebelumnya
        portfolioWindows.forEach(windowEl => {
            windowEl.classList.remove('slide-out-left', 'slide-out-top', 'slide-out-bottom', 'slide-out-right');
            windowEl.classList.add('initial-state'); // Pastikan kembali ke posisi awal untuk animasi masuk
        });


        // Tampilkan main portfolio (sebagai grid)
        mainPortfolio.style.display = 'grid'; // Pastikan ini 'grid' agar layout berfungsi
        // Hapus slide-up-to-top agar bisa slide-down-from-top dengan benar
        mainPortfolio.classList.remove('slide-up-to-top');
        mainPortfolio.classList.add('active', 'slide-down-from-top'); // Aktifkan display grid dan animasikan masuk

        // Tunggu mainPortfolio selesai slide-down
        await Promise.race([
            new Promise(resolve => {
                mainPortfolio.addEventListener('transitionend', function handler() {
                    mainPortfolio.removeEventListener('transitionend', handler);
                    resolve();
                }, { once: true });
            }),
            new Promise(resolve => setTimeout(resolve, 100)) // Fallback
        ]);

        // Mulai animasi masuk individual terminal satu per satu setelah mainPortfolio sepenuhnya muncul
        await new Promise(resolve => setTimeout(resolve, 50)); // Sedikit delay sebelum memulai animasi terminal

        cvTerminal.classList.remove('initial-state');
        cvTerminal.classList.add('slide-in-left');
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay untuk terminal berikutnya

        gamesTerminal.classList.remove('initial-state');
        gamesTerminal.classList.add('slide-in-top');
        await new Promise(resolve => setTimeout(resolve, 100));

        chatbotTerminal.classList.remove('initial-state');
        chatbotTerminal.classList.add('slide-in-bottom');
        await new Promise(resolve => setTimeout(resolve, 100));

        logoBottom.classList.remove('initial-state');
        logoBottom.classList.add('slide-in-right');

        // Mulai pengetikan CV setelah semua elemen masuk
        // Beri waktu lebih untuk semua transisi selesai sebelum mengetik
        setTimeout(() => {
            if (!cvTyped) {
                cvTerminalOutput.classList.add('typing');
                typeWriter(cvTerminalOutput, cvContent, 0, 10);
                cvTyped = true;
            }
        }, 800); // Sesuaikan delay ini agar sesuai dengan animasi masuk terakhir
    }

    async function returnToIntro() {
        // Hentikan semua game interval
        clearInterval(flappyBirdGameInterval);
        clearInterval(snakeGameInterval);

        // Mulai animasi keluar satu per satu secara berurutan
        logoBottom.classList.remove('slide-in-right');
        logoBottom.classList.add('slide-out-right');
        await new Promise(resolve => setTimeout(resolve, 100));

        chatbotTerminal.classList.remove('slide-in-bottom');
        chatbotTerminal.classList.add('slide-out-bottom');
        await new Promise(resolve => setTimeout(resolve, 100));

        gamesTerminal.classList.remove('slide-in-top');
        gamesTerminal.classList.add('slide-out-top');
        await new Promise(resolve => setTimeout(resolve, 100));

        cvTerminal.classList.remove('slide-in-left');
        cvTerminal.classList.add('slide-out-left');

        // Tunggu semua animasi keluar dari jendela individual selesai
        await new Promise(resolve => setTimeout(resolve, 700)); // Durasi transisi 0.7s

        // Animasi main portfolio keluar (geser ke atas)
        mainPortfolio.classList.remove('active', 'slide-down-from-top'); // Hapus kelas masuk
        mainPortfolio.classList.add('slide-up-to-top'); // Tambahkan kelas keluar

        // Tunggu transisi main portfolio selesai
        await Promise.race([
            new Promise(resolve => {
                mainPortfolio.addEventListener('transitionend', function handler() {
                    mainPortfolio.removeEventListener('transitionend', handler);
                    resolve();
                }, { once: true });
            }),
            new Promise(resolve => setTimeout(resolve, 800)) // Fallback
        ]);

        mainPortfolio.style.display = 'none'; // Sembunyikan sepenuhnya setelah transisi
        mainPortfolio.classList.remove('slide-up-to-top'); // Hapus kelas keluar setelah selesai

        // Reset kelas slide-out dan tambahkan initial-state agar siap untuk masuk lagi nanti
        portfolioWindows.forEach(windowEl => {
            windowEl.classList.remove('slide-out-left', 'slide-out-top', 'slide-out-bottom', 'slide-out-right');
            windowEl.classList.add('initial-state');
        });

        // Tampilkan kembali intro screen
        introScreen.style.display = 'flex'; // Kembalikan display
        introScreen.classList.remove('fade-out'); // Hapus fade-out
        introScreen.classList.remove('slide-down-from-top'); // Pastikan tidak ada kelas slide-down yang tersisa dari awal

        // Paksa reflow untuk memastikan kelas dihapus sebelum ditambahkan lagi (penting untuk animasi ulang)
        void introScreen.offsetWidth;

        // Tambahkan kelas slide-down-from-top ke introScreen untuk memulai animasi masuk
        introScreen.classList.add('slide-down-from-top');

        // Animasikan elemen-elemen di intro screen agar fade in satu per satu
        // Dapatkan referensi ulang jika perlu, atau pastikan sudah ada di scope
        const introElementsToFade = document.querySelectorAll('.intro-content, .intro-photo, .intro-heading, .ascii-art-intro, .launch-btn, .copyright-text');

        // Remove previous fade-in classes to re-trigger animation
        introElementsToFade.forEach(el => {
            el.classList.remove('fade-in');
        });

        // Re-add fade-in classes with delay for sequential effect
        setTimeout(() => document.querySelector('.intro-content').classList.add('fade-in'), 50);
        setTimeout(() => document.querySelector('.intro-photo').classList.add('fade-in'), 200);
        setTimeout(() => document.querySelector('.intro-heading').classList.add('fade-in'), 400);
        setTimeout(() => document.querySelector('.ascii-art-intro').classList.add('fade-in'), 600);
        setTimeout(() => launchBtn.classList.add('fade-in'), 800);
        setTimeout(() => document.querySelector('.copyright-text').classList.add('fade-in'), 1000);


        // Re-initialize matrix effect
        matrixAnimationIdLeft = initializeMatrixEffect(matrixCanvasLeft, matrixCtxLeft);
        matrixAnimationIdRight = initializeMatrixEffect(matrixCanvasRight, matrixCtxRight);

        // Reset cvTyped agar mengetik ulang saat masuk lagi
        cvTyped = false;
        cvTerminalOutput.innerHTML = ''; // Kosongkan CV
        showGamesMenu(); // Reset game menu
        showChatbotMenu(); // Reset chatbot menu
    }

    // --- Event Listeners untuk Transisi ---
    launchBtn.addEventListener('click', showPortfolio);

    // Menambahkan event listener untuk mengatasi klik di seluruh area intro-screen
    // Ini memastikan intro bisa di-skip bahkan jika tombol tidak diklik langsung
    introScreen.addEventListener('click', (e) => {
        // Hanya picu showPortfolio jika klik bukan pada tombol launch atau elemen di dalamnya
        if (e.target.id !== 'launch-terminal-btn' && !e.target.closest('#launch-terminal-btn')) {
             // Jika ingin mengizinkan klik di mana saja untuk melanjutkan
             // showPortfolio();
        }
    });

    // Event listener untuk logo di bagian bawah portfolio untuk kembali ke intro
mainLogoReturn.addEventListener('click', () => {
    grudgeSound.pause(); // Ini sudah ada, menghentikan di awal jumpscare
    grudgeSound.currentTime = 0;
    jumpscareGif.style.objectFit = 'cover';
    jumpscareGif.style.width = '100%';
    jumpscareGif.style.height = '100%';
    jumpscareGif.style.display = 'block';

    // Set audio untuk looping
    jumpscareAudio.loop = true; // Ini akan membuat audio mengulang
    jumpscareAudio.play();

    // ... (openFullscreenForImage)

    // Sembunyikan GIF dan hentikan audio setelah 320 detik
    setTimeout(() => {
        jumpscareGif.style.display = 'none';
        jumpscareAudio.pause(); // Hentikan pemutaran audio
        jumpscareAudio.currentTime = 0; // Opsional: reset audio ke awal

        if (grudgeSound) { // Periksa apakah elemen grudgeSound ditemukan
            grudgeSound.pause();
            grudgeSound.currentTime = 0;
        }
        
        // Opsional: Keluar dari fullscreen
        if (document.fullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
        }
    }, 3600000); // 3600 detik
});


    closeButtons.forEach(button => {
        button.addEventListener('click', returnToIntro); // Menggunakan returnToIntro untuk tombol 'x'
    });

    // === Fungsi Fullscreen untuk Gambar (tetap opsional) ===
    function openFullscreenForImage(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) { /* Safari */
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { /* IE11 */
            element.msRequestFullscreen();
        }
    }

    // Tambahkan event listener untuk scroll
    // Hati-hati dengan ini, bisa menyebabkan perilaku yang tidak diinginkan
    // jika user hanya ingin scroll intro, bukan langsung ke portfolio.
    // Saya sarankan hanya mengandalkan tombol 'LAUNCH TERMINAL'.
    // Jika tetap ingin, pastikan logikanya lebih robust.
    // Misalnya, hanya aktifkan setelah beberapa detik intro berjalan.
    let scrollTriggered = false; // Flag untuk mencegah trigger berulang
    window.addEventListener('scroll', () => {
        if (!scrollTriggered && window.scrollY > 50 && introScreen.style.display !== 'none') {
            //showPortfolio(); // Aktifkan jika ingin scroll memicu perpindahan
            //scrollTriggered = true; // Set flag agar tidak terpicu lagi
        }
    });

    // Pastikan ukuran canvas diatur ulang jika ukuran jendela berubah
    window.addEventListener('resize', () => {
        // Hentikan animasi saat resize untuk menghindari glitch
        stopMatrixAnimation(matrixAnimationIdLeft);
        stopMatrixAnimation(matrixAnimationIdRight);

        // Atur ulang ukuran canvas
        matrixCanvasLeft.width = matrixCanvasLeft.offsetWidth;
        matrixCanvasLeft.height = window.innerHeight;
        matrixCanvasRight.width = matrixCanvasRight.offsetWidth;
        matrixCanvasRight.height = window.innerHeight;

        // Re-initialize matrix effect setelah resize
        matrixAnimationIdLeft = initializeMatrixEffect(matrixCanvasLeft, matrixCtxLeft);
        matrixAnimationIdRight = initializeMatrixEffect(matrixCanvasRight, matrixCtxRight);

        // Jika main portfolio aktif dan layoutnya bergantung pada ukuran,
        // pertimbangkan untuk memicu redraw atau reset tampilan grid jika diperlukan
        if (mainPortfolio.classList.contains('active')) {
             // Ini mungkin tidak diperlukan jika CSS responsif sudah menangani dengan baik.
             // window.dispatchEvent(new Event('resize')); // Hanya contoh, jangan lakukan jika tidak perlu
        }
    });

    // --- A. Terminal Kiri: CV Tampilan ---
   const cvContent = `
Selamat datang di Portofolio Terminal Gede Ananta Pradnya!

╭───────────────────────────────────────────────╮
│               DATA PRIBADI                    │
├───────────────────────────────────────────────┤
│ Nama Lengkap : Gede Ananta Pradnya            │
│ Tempat, Tgl. Lahir : -                        │
│ Alamat : -                                    │
│ Email : -                                     │
│ Telepon : -                                   │
╰───────────────────────────────────────────────╯

╭───────────────────────────────────────────────╮
│                 PENDIDIKAN                    │
├───────────────────────────────────────────────┤
│ 2021 - Sekarang : Universitas Gunadarma       │
│                   (Informatika)               │
│ 2018 - 2021     : SMAK Katolik Santo Yoseph   │
│                   (IPA)                       │
╰───────────────────────────────────────────────╯

╭───────────────────────────────────────────────╮
│                  KEMAMPUAN                    │
├───────────────────────────────────────────────┤
│ Bahasa Pemrograman: Python, JavaScript        │
│ Database          : MySQL, PostgreSQL, MongoDB│
│ Tools             : Git, Docker, VS Code      │
│ Bahasa            : Indonesia (Native),       │
│                     English (Intermediate)    │
╰───────────────────────────────────────────────╯

╭───────────────────────────────────────────────╮
│               PROYEK TERPILIH                 │
├───────────────────────────────────────────────┤
│ 1. Kobara Secure Chrome Extension             │
│    (Skills: Python, HTML)                     │
│ 2. UI/UX Design for MAOS Mobile App           │
│    (Skills: Figma)                            │
│ 3. Website Portofolio Terminal (Ini dia!)     │
│    (HTML, CSS, JavaScript)                    │
╰───────────────────────────────────────────────╯

╭───────────────────────────────────────────────╮
│                   PENGALAMAN                  │
├───────────────────────────────────────────────┤
│ 2025 - 2025 : MK Praktikum Unggulan (DGX)     │
│               (Asisten)                       │
│ 2023 - 2024 : Laboratorium Sistem Informasi   │
│               (Asisten)                       │
╰───────────────────────────────────────────────╯

\`\`\`
Namaste -_-
\`\`\`
    `;

    function typeWriter(element, text, i = 0, speed = 20) {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            element.scrollTop = element.scrollHeight;
            setTimeout(() => typeWriter(element, text, i + 1, speed), speed);
        } else {
            element.classList.remove('typing');
        }
    }


    // --- B. Terminal Kanan Atas: Games ---

    const gamesMenu = `
Selamat datang di NajaDS_Games!
Ketik nama game untuk bermain:

- flappybird
- snake

Ketik 'menu' untuk melihat menu ini lagi.
`;

    function printGames(message) {
        gamesTerminalOutput.innerHTML += message + '<br>';
        gamesTerminalOutput.scrollTop = gamesTerminalOutput.scrollHeight;
    }

    function showGamesMenu() {
        gamesTerminalOutput.innerHTML = '';
        printGames(gamesMenu);
        gamesCurrentState = 'menu';
        gamesTerminalInput.focus();
    }


    gamesTerminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = gamesTerminalInput.value.trim().toLowerCase();
            gamesTerminalInput.value = '';

            printGames(`<span style="color: yellow;">user@games:~$ </span>${command}`);

            handleGamesCommand(command);
        }
    });

    function handleGamesCommand(command) {
        if (command === 'menu') {
            clearInterval(flappyBirdGameInterval);
            clearInterval(snakeGameInterval);
            showGamesMenu();
            return;
        }

        switch (gamesCurrentState) {
            case 'menu':
                if (command === 'flappybird') {
                    startGameFlappyBird();
                } else if (command === 'snake') {
                    startGameSnake();
                } else {
                    printGames("Game tidak ditemukan. Ketik 'flappybird' atau 'snake'.");
                }
                break;
            case 'flappybird':
                handleFlappyBirdInput(command);
                break;
            case 'snake':
                handleSnakeInput(command);
                break;
        }
    }

    // Game Flappy Bird (ASCII) - Logic
    const FLAPPY_BIRD_WIDTH = 40;
    const FLAPPY_BIRD_HEIGHT = 15;
    let birdY, birdVelocity, pipes, flappyBirdScore, flappyBirdGameOver;

    function startGameFlappyBird() {
        printGames("Memulai Game Flappy Bird... Ketik 'spasi' atau klik layar untuk melompat.");
        printGames("Ketik 'menu' untuk kembali.");
        gamesCurrentState = 'flappybird';
        initializeFlappyBird();
        flappyBirdGameInterval = setInterval(updateFlappyBirdGame, 200);
    }

    function initializeFlappyBird() {
        birdY = Math.floor(FLAPPY_BIRD_HEIGHT / 2);
        birdVelocity = 0;
        pipes = [];
        flappyBirdScore = 0;
        flappyBirdGameOver = false;
        gamesTerminalOutput.innerHTML = '';
        printGames(`Skor: ${flappyBirdScore}`);
        generatePipe();
    }

    function generatePipe() {
        const gapHeight = 5;
        const gapPosition = Math.floor(Math.random() * (FLAPPY_BIRD_HEIGHT - gapHeight - 2)) + 1;
        const newPipe = [];
        for (let i = 0; i < FLAPPY_BIRD_HEIGHT; i++) {
            newPipe.push((i < gapPosition || i >= gapPosition + gapHeight) ? '#' : ' ');
        }
        pipes.push({ x: FLAPPY_BIRD_WIDTH - 5, segments: newPipe });
    }

    function updateFlappyBirdGame() {
        if (flappyBirdGameOver) return;

        birdVelocity += 1;
        birdY += birdVelocity;

        if (birdY < 0 || birdY >= FLAPPY_BIRD_HEIGHT) {
            endFlappyBirdGame();
            return;
        }

        for (let i = 0; i < pipes.length; i++) {
            pipes[i].x--;
        }

        if (pipes.length > 0 && pipes[0].x < -5) {
            pipes.shift();
            flappyBirdScore++;
            printGames(`Skor: ${flappyBirdScore}`);
        }

        if (pipes.length === 0 || pipes[pipes.length - 1].x < FLAPPY_BIRD_WIDTH / 2) {
            generatePipe();
        }

        const birdX = 5;
        if (pipes.length > 0) {
            const firstPipe = pipes[0];
            if (birdX >= firstPipe.x && birdX < firstPipe.x + 2) {
                if (firstPipe.segments[birdY] === '#') {
                    endFlappyBirdGame();
                    return;
                }
            }
        }
        drawFlappyBirdGame();
    }

    function drawFlappyBirdGame() {
        let board = Array(FLAPPY_BIRD_HEIGHT).fill(0).map(() => Array(FLAPPY_BIRD_WIDTH).fill(' '));

        if (birdY >= 0 && birdY < FLAPPY_BIRD_HEIGHT) {
            board[birdY][5] = '>';
        }

        for (const pipe of pipes) {
            for (let y = 0; y < FLAPPY_BIRD_HEIGHT; y++) {
                if (pipe.x >= 0 && pipe.x < FLAPPY_BIRD_WIDTH && y >= 0 && y < FLAPPY_BIRD_HEIGHT) {
                    if (pipe.segments[y] === '#') {
                        board[y][pipe.x] = '#';
                        if (pipe.x + 1 < FLAPPY_BIRD_WIDTH) {
                            board[y][pipe.x + 1] = '#';
                        }
                    }
                }
            }
        }
        gamesTerminalOutput.innerHTML = board.map(row => row.join('')).join('\n');
        gamesTerminalOutput.scrollTop = gamesTerminalOutput.scrollHeight;
    }

    function endFlappyBirdGame() {
        clearInterval(flappyBirdGameInterval);
        flappyBirdGameOver = true;
        printGames("GAME OVER! Skor Anda: " + flappyBirdScore);
        printGames("Ketik 'menu' untuk kembali.");
        gamesCurrentState = 'menu';
    }

    function handleFlappyBirdInput(command) {
        if (command === 'spasi' || command === '') {
            birdVelocity = -3;
        } else {
            printGames("Perintah tidak dikenal. Ketik 'spasi' untuk melompat, atau 'menu' untuk kembali.");
        }
    }

    // Game Snake (ASCII) - Logic
    const SNAKE_WIDTH = 30;
    const SNAKE_HEIGHT = 15;
    let snake, food, direction, snakeScore, snakeGameOver;

    function startGameSnake() {
        printGames("Memulai Game Snake... Gunakan 'w' (atas), 's' (bawah), 'a' (kiri), 'd' (kanan) untuk bergerak.");
        printGames("Ketik 'menu' untuk kembali.");
        gamesCurrentState = 'snake';
        initializeSnakeGame();
        snakeGameInterval = setInterval(updateSnakeGame, 200);
    }

    function initializeSnakeGame() {
        snake = [{ x: 5, y: 5 }];
        food = generateFood();
        direction = 'right';
        snakeScore = 0;
        snakeGameOver = false;
        gamesTerminalOutput.innerHTML = '';
        printGames(`Skor: ${snakeScore}`);
    }

    function generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * SNAKE_WIDTH),
                y: Math.floor(Math.random() * SNAKE_HEIGHT)
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
    }

    function updateSnakeGame() {
        if (snakeGameOver) return;

        const head = { ...snake[0] };

        switch (direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        if (head.x < 0 || head.x >= SNAKE_WIDTH || head.y < 0 || head.y >= SNAKE_HEIGHT) {
            endSnakeGame();
            return;
        }

        if (snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)) {
            endSnakeGame();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            snakeScore++;
            printGames(`Skor: ${snakeScore}`);
            food = generateFood();
        } else {
            snake.pop();
        }
        drawSnakeGame();
    }

    function drawSnakeGame() {
        gamesTerminalOutput.innerHTML = '';
        let board = Array(SNAKE_HEIGHT).fill(0).map(() => Array(SNAKE_WIDTH).fill(' '));

        snake.forEach(segment => {
            if (segment.x >= 0 && segment.x < SNAKE_WIDTH && segment.y >= 0 && segment.y < SNAKE_HEIGHT) {
                board[segment.y][segment.x] = 'O';
            }
        });

        if (food.x >= 0 && food.x < SNAKE_WIDTH && food.y >= 0 && food.y < SNAKE_HEIGHT) {
            board[food.y][food.x] = '@';
        }

        let display = '';
        display += '#' + '#'.repeat(SNAKE_WIDTH) + '#\n';
        for (let y = 0; y < SNAKE_HEIGHT; y++) {
            display += '#' + board[y].join('') + '#\n';
        }
        display += '#' + '#'.repeat(SNAKE_WIDTH) + '#';

        gamesTerminalOutput.innerHTML = display;
        gamesTerminalOutput.scrollTop = gamesTerminalOutput.scrollHeight;
    }

    function endSnakeGame() {
        clearInterval(snakeGameInterval);
        snakeGameOver = true;
        printGames("GAME OVER! Skor Anda: " + snakeScore);
        printGames("Ketik 'menu' untuk kembali.");
        gamesCurrentState = 'menu';
    }

    function handleSnakeInput(command) {
        if (command === 'w' && direction !== 'down') direction = 'up';
        else if (command === 's' && direction !== 'up') direction = 'down';
        else if (command === 'a' && direction !== 'right') direction = 'left';
        else if (command === 'd' && direction !== 'left') direction = 'right';
        else {
            printGames("Perintah tidak dikenal. Gunakan 'w', 's', 'a', 'd', atau 'menu'.");
        }
    }

    document.addEventListener('click', (e) => {
        // Hanya pemicu Flappy Bird jika game sedang aktif dan klik di luar input
        if (gamesCurrentState === 'flappybird' && e.target !== gamesTerminalInput) {
            handleFlappyBirdInput('spasi');
        }
    });

    // --- C. Terminal Kanan Bawah: Chatbot ---

    const chatbotMenu = `
Selamat datang di Chatbot NajaDS!
Pilih pertanyaan yang ingin Anda tanyakan:

- Pendidikan
- Kemampuan
- Proyek
- Kontak

Ketik 'menu' untuk melihat menu ini lagi.
Ketik 'clear' untuk membersihkan chat.
`;

    function printChatbot(message, isUser = false) {
        const prefix = isUser ? `<span style="color: yellow;">user@chatbot:~$ </span>` : '';
        chatbotTerminalOutput.innerHTML += prefix + message + '<br>';
        chatbotTerminalOutput.scrollTop = chatbotTerminalOutput.scrollHeight;
    }

    function showChatbotMenu() {
        chatbotTerminalOutput.innerHTML = '';
        printChatbot(chatbotMenu);
        chatbotCurrentState = 'start';
        chatbotTerminalInput.focus();
    }


    chatbotTerminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = chatbotTerminalInput.value.trim().toLowerCase();
            chatbotTerminalInput.value = '';

            printChatbot(command, true);

            handleChatbotCommand(command);
        }
    });

    function handleChatbotCommand(command) {
        if (command === 'menu') {
            showChatbotMenu();
            return;
        }
        if (command === 'clear') {
            chatbotTerminalOutput.innerHTML = '';
            printChatbot(chatbotMenu);
            return;
        }

        switch (command) {
            case 'pendidikan':
                printChatbot("Hi namaku Gede Ananta Pradnya saat ini berkuliah di Universitas Gunadarma jurusan Informatika. Sebelumnya menempuh pendidikan di SMAK Santo Yoseph.");
                break;
            case 'kemampuan':
                printChatbot("Aku memiliki kemampuan di bidang pemrograman (Python & JavaScript), database (SQL & NoSQL), dan design platform seperti Figma.");
                break;
            case 'proyek':
                printChatbot("Beberapa proyek yang pernah aku buat yaitu Kobara Secure Ekstensi Chrome, Design Aplikasi E-Book sederhana, dan tentu saja Portofolio Terminal ini!");
                break;
            case 'kontak':
                printChatbot("Kamu bisa menghubungi aku melalui email: pradnyadean@email.com atau melalui linkedinku ya.");
                break;
            default:
                printChatbot("Maaf, aku tidak mengerti. Silakan ketik 'Pendidikan', 'Kemampuan', 'Proyek', 'Kontak', atau 'menu' untuk melihat pilihan.");
                break;
        }
    }

    // Panggil fungsi untuk mengisi menu game dan chatbot di awal
    // PENTING: Baris ini DIPINDAHKAN ke SINI agar gamesMenu dan chatbotMenu sudah didefinisikan!
    showGamesMenu();
    showChatbotMenu();
});
