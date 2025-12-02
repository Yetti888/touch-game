const gameArea = document.getElementById("game-area");
let score = 0;
let time = 30;
let timerInterval;

let level = 1;          // рівень
let baseSpeed = 1.2;    // базова швидкість руху кульок

// Звуки
const popSounds = [
    new Audio("pop_1.wav"),
    new Audio("pop_2.wav")
];

const explosionSound = new Audio("explosion.wav");

function playPop() {
    const s = popSounds[Math.floor(Math.random() * popSounds.length)];
    s.currentTime = 0;
    s.play();
}

function playExplosion() {
    explosionSound.currentTime = 0;
    explosionSound.play();
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

    const x = Math.random() * (gameArea.clientWidth - size);
    const y = Math.random() * (gameArea.clientHeight - size);
    circle.style.left = x + "px";
    circle.style.top = y + "px";

    // швидкість за рівнем
    const speed = baseSpeed + level * 0.5;

    let dx = (Math.random() - 0.5) * speed * 2;
    let dy = (Math.random() - 0.5) * speed * 2;

    function move() {
        if (!circle.parentNode) return;

        let cx = circle.offsetLeft + dx;
        let cy = circle.offsetTop + dy;

        if (cx <= 0 || cx >= gameArea.clientWidth - size) dx *= -1;
        if (cy <= 0 || cy >= gameArea.clientHeight - size) dy *= -1;

        circle.style.left = (circle.offsetLeft + dx) + "px";
        circle.style.top = (circle.offsetTop + dy) + "px";

        requestAnimationFrame(move);
    }

    requestAnimationFrame(move);

    circle.addEventListener("click", () => {
        score++;
        document.getElementById("score").textContent = score;

        playExplosion();

        circle.remove();

        // оновлення рівня
        level = Math.floor(score / 5) + 1;

        spawnCircle();
    });

    gameArea.appendChild(circle);
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
    level = 1;

    document.getElementById("score").textContent = 0;
    document.getElementById("time").textContent = 30;

    document.getElementById("resultModal").style.display = "none";

    startGame();
}

function goHome() {
    window.location.href = "index.html";
}

startGame();
