// ===== Constants =====
let tick = 0;
let isPlaying = false;
const gravity = 0.5;

// ===== HTML Elements =====

const clockElement = document.querySelector("#tick");
const jumpElement = document.querySelector("#jump");
const playPause = document.querySelector("#play-pause-btn"); 
const scene = document.querySelector("#scene");

function updateDisplay(time = 0, height = 0, velocity = 0) {
  clockElement.textContent = `Time: ${time.toFixed(2)} seconds`;
  jumpElement.textContent = `Height: ${height.toFixed(1)} cm. Velocity: ${velocity.toFixed(1)} cm/s`;
}

// ===== Sprites =====
const dinosaurSprite = document.querySelector("#character");

const backgroundMusic = new Audio('./assets/music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

// ===== Obstacle & Score =====
const obstacle = document.querySelector("#obstacle");
let obstacleX = window.innerWidth;
const obstacleSpeed = 6;

let score = 0;
const scoreElement = document.querySelector("#score");
scoreElement.textContent = `Score: ${score}`;

clockElement.textContent = tick;
playPause.textContent = isPlaying ? "Is Playing" : "Is Paused";
updateDisplay(0, 0, 0);

class Dinosaur {
  constructor(sprite) {
    this.sprite = sprite;
    this.y = 0;
    this.vy = 0;
    this.gravity = 0.5;
    this.jumpStrength = 10;
    this.isOnGround = true;
    this.maxFallSpeed = 20;
    this.jumpCount = 0;
    this.maxJumps = 2;
  }

  jump() {
    if (this.jumpCount < this.maxJumps) {
      this.vy = -this.jumpStrength;
      this.jumpCount++;
    }
  }

  update() {
    this.vy += this.gravity;
    if (this.vy > this.maxFallSpeed) this.vy = this.maxFallSpeed;

    this.y += this.vy;

    if (this.y > 0) {
      this.y = 0;
      this.vy = 0;
      this.jumpCount = 0;
    }

    this.sprite.style.bottom = `${-this.y}px`;
  }
}

const dinosaur = new Dinosaur(dinosaurSprite);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    dinosaur.jump();
  }
});

document.addEventListener("click", () => dinosaur.jump());

function gameLoop(timeStamp) {
  if (isPlaying) {
    dinosaur.update();
    updateObstacle();
    checkCollision();

    updateDisplay(timeStamp / 1000, -dinosaur.y, dinosaur.vy);

    requestAnimationFrame(gameLoop);
  }
}
function updateObstacle() {
  const dynamicSpeed = obstacleSpeed + score * 0.8;
  obstacleX -= dynamicSpeed;

  if (obstacleX < -obstacle.offsetWidth) {
    obstacleX = window.innerWidth;
    score++;
    scoreElement.textContent = `Score: ${score}`;

    // Randomize the obstacle size
    const newWidth = 40 + Math.random() * 20; 
    const newHeight = 40 + Math.random() * 30; 
    obstacle.style.width = `${newWidth}px`;
    obstacle.style.height = `${newHeight}px`
  }
    obstacle.style.left = `${obstacleX}px`;

}

function isColliding(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function checkCollision() {
  const dinoRect = dinosaur.sprite.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();
  if (isColliding(dinoRect, obstacleRect)) {
    isPlaying = false;
    backgroundMusic.pause();
    alert(
      `Game over!\n\nYour dino hit the cactus.\n\nYour score was ${score}.\n\nRefresh the page to play again.`
    );
    playPause.textContent = "Game Over!";
  }
}

playPause.addEventListener("click", (e) => {
  if (isPlaying) {
    playPause.textContent = "Is Paused";
    isPlaying = false;
  } else {
    playPause.textContent = "Is Playing";
    isPlaying = true;
    backgroundMusic.play();
    requestAnimationFrame(gameLoop);
  }
});

window.addEventListener("click", function startGame() {
  if (!isPlaying) {
    isPlaying = true;
    backgroundMusic.play().catch(() => {});
    requestAnimationFrame(gameLoop);
    playPause.textContent = "Is Playing";
    window.removeEventListener("click", startGame);
  }
});




gameLoop(tick);
