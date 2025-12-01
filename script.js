const gameArea = document.getElementById("game-area");
let score = 0;
let time = 30;
let timerInterval;

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

    // Рандомні розміри
    const size = Math.floor(Math.random() * 70) + 40;
    circle.style.width = size + "px";
    circle.style.height = size + "px";

    // Рандомні кольори
    circle.style.background = randomColor();

    // Випадкове положення
    const x = Math.random() * (gameArea.clientWidth - size);
    const y = Math.random() * (gameArea.clientHeight - size);
    circle.style.left = x + "px";
    circle.style.top = y + "px";

    // Клік
    circle.addEventListener("click", () => {
        score++;
        document.getElementById("score").textContent = score;
        playSound();
        circle.remove();
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
    document.getElementById("score").textContent = score;
    document.getElementById("time").textContent = time;

    document.getElementById("resultModal").style.display = "none";

    startGame();
}

function goHome() {
    window.location.href = "index.html";
}

startGame();
