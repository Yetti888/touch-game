const gameArea = document.getElementById("game-area");
let score = 0;
let time = 30;
let timerInterval;
let speedFactor = 1;

// Звуки
const sounds = [
    new Audio("pop_1.wav"),
    new Audio("pop_2.wav")
];

function playSound() {
    const s = sounds[Math.floor(Math.random() * sounds.length)];
    s.currentTime = 0;
    s.play();
}

// Анімація вибуху спрайтом
function spawnExplosion(x, y) {
    const explosion = document.createElement("div");
    explosion.classList.add("explosion");
    explosion.style.left = (x - 64) + "px";
    explosion.style.top = (y - 64) + "px";
    gameArea.appendChild(explosion);

    // Анімація спрайта
    let frame = 0;
    const totalFrames = 8;
    const interval = setInterval(() => {
        explosion.style.backgroundPosition = `-${frame * 128}px 0`;
        frame++;
        if (frame >= totalFrames) {
            clearInterval(interval);
            explosion.remove();
        }
    }, 50);
}

function startGame() {
    timerInterval = setInterval(() => {
        time--;
        document.getElementById("time").textContent = time;

        if (time <= 0) endGame();
    }, 1000);

    spawnCircle();
}

function spawnCircle() {
    if (time <= 0) return;

    const circle = document.createElement("div");
    circle.classList.add("circle");

    const size = Math.floor(Math.random() * 70) + 40;
    circle.style.width = size + "px";
    circle.style.height = size + "px";
    circle.style.background = randomColor();

    // Початкове положення
    let x = Math.random() * (gameArea.clientWidth - size);
    let y = Math.random() * (gameArea.clientHeight - size);
    circle.style.left = x + "px";
    circle.style.top = y + "px";

    gameArea.appendChild(circle);

    // Рух кульки
    let dx = (Math.random() * 2 - 1) * speedFactor;
    let dy = (Math.random() * 2 - 1) * speedFactor;

    const moveInterval = setInterval(() => {
        x += dx;
        y += dy;

        if (x <= 0 || x + size >= gameArea.clientWidth) dx = -dx;
        if (y <= 0 || y + size >= gameArea.clientHeight) dy = -dy;

        circle.style.left = x + "px";
        circle.style.top = y + "px";
    }, 20);

    circle.addEventListener("click", (event) => {
        const rect = circle.getBoundingClientRect();
        const centerX = rect.left + size / 2;
        const centerY = rect.top + size / 2;

        playSound();
        spawnExplosion(centerX, centerY);

        score++;
        document.getElementById("score").textContent = score;

        speedFactor += 0.05; // Кожен клік трохи прискорює кульки

        clearInterval(moveInterval);
        circle.remove();
        spawnCircle();
    });
}

function randomColor() {
    const colors = ["#ff4d4d", "#4d94ff", "#4dff88", "#ffdb4d", "#ff66cc"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function endGame() {
    clearInterval(timerInterval);
    gameArea.innerHTML = "";

    document.getElementById("finalScore").textContent = score;

    const best = localStorage.getItem("bestScore") || 0;

    if (score > best) {
        localStorage.setItem("bestScore", score);
        document.getElementById("recordMessage").textContent = "🎉 Новий рекорд!";
    } else {
        document.getElementById("recordMessage").textContent = "";
    }

    document.getElementById("resultModal").style.display = "flex";
}

function restartGame() {
    score = 0;
    time = 30;
    speedFactor = 1;
    document.getElementById("score").textContent = score;
    document.getElementById("time").textContent = time;

    document.getElementById("resultModal").style.display = "none";

    startGame();
}

function goHome() {
    window.location.href = "index.html";
}

startGame();
