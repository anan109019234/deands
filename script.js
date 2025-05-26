// script.js
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

    // === Matrix Canvas Elements ===
    const matrixCanvasLeft = document.getElementById('matrix-left');
    const matrixCtxLeft = matrixCanvasLeft.getContext('2d');
    const matrixCanvasRight = document.getElementById('matrix-right');
    const matrixCtxRight = matrixCanvasRight.getContext('2d');

    let matrixAnimationIdLeft = null;
    let matrixAnimationIdRight = null;


    // === State Variables ===
    let gamesCurrentState = 'menu'; // 'menu', 'flappybird', 'snake'
    let chatbotCurrentState = 'start'; // 'start', 'asking'

    let flappyBirdGameInterval;
    let snakeGameInterval;

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
        return setInterval(drawMatrix, 50); // Kecepatan animasi
    }

    // --- Fungsi untuk Menghentikan Animasi Matrix ---
    function stopMatrixAnimation(animationId) {
        if (animationId) {
            clearInterval(animationId);
        }
    }

    // --- Fungsi untuk Transisi Halaman ---
    function showPortfolio() {
        // Hentikan animasi Matrix saat beralih ke portfolio
        stopMatrixAnimation(matrixAnimationIdLeft);
        stopMatrixAnimation(matrixAnimationIdRight);

        // Hapus kelas 'hidden' terlebih dahulu agar transisi bisa berjalan
        mainPortfolio.classList.remove('hidden');

        // Tambahkan kelas untuk floating in dari bawah
        mainPortfolio.classList.add('slide-up-from-bottom');

        // Sembunyikan intro screen dengan efek floating ke atas
        introScreen.classList.add('fade-out');

        // Setelah transisi intro selesai, pastikan intro benar-benar tidak terlihat
        introScreen.addEventListener('transitionend', function handler() {
            if (introScreen.classList.contains('fade-out')) {
                introScreen.style.display = 'none'; // Sembunyikan secara permanen
            }
            introScreen.removeEventListener('transitionend', handler);
        });
    }

    // Fungsi untuk me-reload halaman
    function reloadPage() {
        location.reload();
    }

    // --- Event Listeners untuk Transisi ---
    launchBtn.addEventListener('click', showPortfolio);
    mainLogoReturn.addEventListener('click', reloadPage);

    // Tambahkan event listener untuk semua tombol 'x'
    closeButtons.forEach(button => {
        button.addEventListener('click', reloadPage);
    });

    // --- Inisialisasi Matrix Effect saat halaman dimuat ---
    matrixAnimationIdLeft = initializeMatrixEffect(matrixCanvasLeft, matrixCtxLeft);
    matrixAnimationIdRight = initializeMatrixEffect(matrixCanvasRight, matrixCtxRight);

    // Pastikan ukuran canvas diatur ulang jika ukuran jendela berubah
    window.addEventListener('resize', () => {
        matrixCanvasLeft.width = matrixCanvasLeft.offsetWidth;
        matrixCanvasLeft.height = window.innerHeight;
        matrixCanvasRight.width = matrixCanvasRight.offsetWidth;
        matrixCanvasRight.height = window.innerHeight;
        // Opsional: re-initialize drops array for a cleaner look after resize
        // stopMatrixAnimation(matrixAnimationIdLeft);
        // stopMatrixAnimation(matrixAnimationIdRight);
        // matrixAnimationIdLeft = initializeMatrixEffect(matrixCanvasLeft, matrixCtxLeft);
        // matrixAnimationIdRight = initializeMatrixEffect(matrixCanvasRight, matrixCtxRight);
    });


    // --- A. Terminal Kiri: CV Tampilan ---
    const cvContent = `
Selamat datang di Portofolio Terminal Gede Ananta Pradnya!

╭───────────────────────────────────────────────╮
│               DATA PRIBADI                    │
├───────────────────────────────────────────────┤
│ Nama Lengkap : Gede Ananta Pradnya            │
│ Tempat, Tgl. Lahir : -                        │
│ Alamat : -                                    │
│ Email : -                                     │
│ Telepon : -                                   │
╰───────────────────────────────────────────────╯

╭───────────────────────────────────────────────╮
│                 PENDIDIKAN                    │
├───────────────────────────────────────────────┤
│ 2021 - Sekarang : Universitas Gunadarma       │
│                   (Informatika)               │
│ 2018 - 2021     : SMAK Katolik Santo Yoseph   │
│                   (IPA)                       │
╰───────────────────────────────────────────────╯

╭───────────────────────────────────────────────╮
│                  KEMAMPUAN                    │
├───────────────────────────────────────────────┤
│ Bahasa Pemrograman: Python, JavaScript        │
│ Database          : MySQL, PostgreSQL, MongoDB│
│ Tools             : Git, Docker, VS Code      │
│ Bahasa            : Indonesia (Native),       │
│                     English (Intermediate)    │
╰───────────────────────────────────────────────╯

╭───────────────────────────────────────────────╮
│               PROYEK TERPILIH                 │
├───────────────────────────────────────────────╮
│ 1. Kobara Secure Chrome Extension             │
│    (Skills: Python, HTML)                     │
│ 2. UI/UX Design for MAOS Mobile App           │
│    (Skills: Figma)                            │
│ 3. Website Portofolio Terminal (Ini dia!)     │
│    (HTML, CSS, JavaScript)                    │
╰───────────────────────────────────────────────╯

╭───────────────────────────────────────────────╮
│                   PENGALAMAN                  │
├───────────────────────────────────────────────┤
│ 2025 - 2025 : MK Praktikum Unggulan (DGX)     │
│               (Asisten)                       │
│ 2023 - 2024 : Laboratorium Sistem Informasi   │
│               (Asisten)                       │
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

    let cvTyped = false;
    mainPortfolio.addEventListener('transitionend', () => {
        if (!cvTyped && !mainPortfolio.classList.contains('hidden')) {
            cvTerminalOutput.classList.add('typing');
            typeWriter(cvTerminalOutput, cvContent, 0, 10);
            cvTyped = true;
        }
    });


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

    showGamesMenu();

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
        if (e.target !== gamesTerminalInput) {
            if (gamesCurrentState === 'flappybird') {
                handleFlappyBirdInput('spasi');
            }
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

    showChatbotMenu();

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
});