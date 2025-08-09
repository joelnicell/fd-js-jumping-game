// ===== Constants =====
let tick = 0;
let isPlaying = true;
let speed = 5;
const MAX_OBJECTS = 3;
const MAX_SPEED = 12;
let score = 0;

// ===== HTML Elements =====

const clockElement = document.querySelector("#tick");
const jumpElement = document.querySelector("#jump");
const playPause = document.querySelector("#play-pause-btn"); // doesn't work yet
const scene = document.querySelector("#scene");
const dinosaurSprite = document.querySelector("#character");

const scoreElement = document.querySelector("#score");
scoreElement.textContent = `Score: ${score}`;

clockElement.textContent = tick;
playPause.textContent = isPlaying ? "Is Playing" : "Is Paused";

// ===== Classes =====

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

    this.box = this.sprite.getBoundingClientRect();
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
    this.box = this.sprite.getBoundingClientRect();
  }
}

class Obstacle {
  constructor() {
    this.x = window.innerWidth;
    this.y = 0;

    const size = Math.floor(Math.random() * 2); // create 3 options for sizes
    this.width = size == 0 ? 30 : size == 1 ? 40 : 50;
    this.height = size == 0 ? 30 : size == 1 ? 40 : 50;
    this.cleared = false;

    // add parent container
    const parent = document.createElement("div");
    parent.classList.add("obstacle");
    parent.style.width = `${this.width}px`;
    parent.style.height = `${this.height}px`;

    // adding img to parent
    const imgElement = document.createElement("img");
    imgElement.src = "./assets/cactus.png";
    parent.appendChild(imgElement);
    scene.appendChild(parent);
    this.sprite = parent;

    this.box = this.sprite.getBoundingClientRect();

    this.isDead = false;

  }

  update() {
    this.x -= speed;
    this.sprite.style.left = `${this.x}px`;
    this.box = this.sprite.getBoundingClientRect();

    // update score if the object is cleared
    if (this.x < 0 && this.cleared == false) {
      this.cleared = true;
      score++;
      if (speed < MAX_SPEED) {
        speed += 0.2;
      }
      scoreElement.textContent = `Score: ${score}`;
    }

    if (this.x < -200 ) {
      this.isDead = true;
      this.sprite.remove();
    }
  }
}

const dinosaur = new Dinosaur(dinosaurSprite);

// ===== Global functions =====
function isColliding(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function checkCollision(dino, obstaclesArray) {
  const dinoRect = dino.box;
  const obstacleRectangles = obstaclesArray.map((o) => o.box);

  obstacleRectangles.forEach((obstacleRect) => {
    if (isColliding(dinoRect, obstacleRect)) {
      isPlaying = false;
      alert(
        `Game over!\n\nYour dino hit the cactus.\n\nYour score was ${score}.\n\nRefresh the page to play again.`
      );
      playPause.textContent = "Game Over!";
    }
  })
}

function generateRandomTimeInterval(slowest = 2, fastest = 0.2) {
  return (Math.random() * (slowest - fastest) + fastest);
}

// ===== Event Listeners =====

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    dinosaur.jump();
  }
});

document.addEventListener("mousedown", () => dinosaur.jump());

playPause.addEventListener("click", (e) => {
  if (isPlaying) {
    playPause.textContent = "Is Paused";
    isPlaying = false;
  } else {
    playPause.textContent = "Is Playing";
    isPlaying = true;
    requestAnimationFrame(gameLoop);
  }
});

// ===== Game =====
let nextInterval = generateRandomTimeInterval();
const obstacles = [];
obstacles.push(new Obstacle());

function gameLoop(timeStamp) {
  const time = (timeStamp / 1000);
  if (isPlaying) {

    // If interval is triggered, create a new obstacle.
    if (time > nextInterval && obstacles.length < MAX_OBJECTS) {
      obstacles.push(new Obstacle());
      nextInterval += generateRandomTimeInterval();
      console.log("time: ", time, "nextInterval: ", nextInterval);
    }

    dinosaur.update();
    obstacles.forEach((obstacle) => {
      obstacle.update();
      if (obstacle.isDead) {
        obstacles.shift(); // remove object from the array
      }
    })
    checkCollision(dinosaur, obstacles);

    clockElement.textContent = "Time: " + time.toFixed(2);
    jumpElement.textContent =
      "Height: " +
      (-dinosaur.y).toFixed(1) +
      ". Velocity: " +
      dinosaur.vy.toFixed(1);

    requestAnimationFrame(gameLoop);
  }
}

gameLoop(tick);
