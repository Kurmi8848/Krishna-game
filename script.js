const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const startBtn = document.getElementById("startBtn");
const speedSelect = document.getElementById("speedSelect");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let score = 0;
let lives = 10;
let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let dx = 0;
let dy = 0;
let gameInterval = null;
let isGameOver = false;

// キー入力の受付
window.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const keyPressed = event.keyCode;
    // 上:38, 下:40, 左:37, 右:39
    if (keyPressed === 37 && dx === 0) { dx = -1; dy = 0; }
    if (keyPressed === 38 && dy === 0) { dx = 0; dy = -1; }
    if (keyPressed === 39 && dx === 0) { dx = 1; dy = 0; }
    if (keyPressed === 40 && dy === 0) { dx = 0; dy = 1; }
}

function startGame() {
    if (lives <= 0) {
        lives = 10;
        score = 0;
    }
    resetSnake();
    isGameOver = false;
    livesEl.innerText = lives;
    scoreEl.innerText = score;
    
    if (gameInterval) clearInterval(gameInterval);
    const speed = parseInt(speedSelect.value);
    gameInterval = setInterval(drawGame, speed);
}

function resetSnake() {
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    placeFood();
}

function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function drawGame() {
    moveSnake();
    if (isGameOver) return;

    checkDeath();

    // 背景クリア
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 餌の描画
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // 蛇の描画
    ctx.fillStyle = "lime";
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function moveSnake() {
    if (dx === 0 && dy === 0) return; // 動いていない時は何もしない

    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.innerText = score;
        placeFood();
    } else {
        snake.pop();
    }
}

function checkDeath() {
    const head = snake[0];
    
    // 壁にぶつかった判定
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        handleMiss();
    }
}

function handleMiss() {
    lives--;
    livesEl.innerText = lives;
    clearInterval(gameInterval);
    
    if (lives > 0) {
        alert("壁にぶつかりました！残りライフ: " + lives);
        resetSnake();
        startGame();
    } else {
        alert("ゲームオーバー！最終スコア: " + score);
        isGameOver = true;
    }
}

startBtn.addEventListener("click", startGame);