// ===== Constants =====
let tick = 0;
let isPlaying = true;
const gravity = 0.5;

// ===== HTML Elements =====

clockElement = document.querySelector("#tick");
jumpElement = document.querySelector("#jump");
playPause = document.querySelector("#play-pause-btn"); // doesn't work yet
scene = document.querySelector("#scene");

// ===== Sprites =====
dinosaurSprite = document.querySelector("#character");

clockElement.textContent = tick;
playPause.textContent = isPlaying ? "Is Playing" : "Is Paused";

playPause.addEventListener("click", (e) => {
    console.log("Clicked!");
    if (isPlaying) {
        e.target.textContent = "Is Paused";
        isPlaying = false;
    } else {
        e.target.textContent = "Is Playing";
        isPlaying = true;
    }
})

// ===== Classes =====

class Dinosaur {
    constructor() {
        // triggers once: set initial values, and add a new sprite to the HTML document
        this.y = 0;
        this.x = 0; // this will be needed to check for collisions with objects
        this.vel = 0;
        const dinosaur = document.createElement("div");
        dinosaur.id = ("character");
        scene.appendChild(dinosaur);
        this.sprite = dinosaur;
    }

    jump() {
        this.vel = 10;
        // console.log("He jumps!");
        return;
    }

    update() {
        // always triggers
        this.y += this.vel;
        this.sprite.style.transform = `translateY(-${this.y}px)`;
        
        // floor check
        if (this.y <= 0) {
            this.y = 0;
            this.vel = 0;
        } else {
            // apply gravity
            this.vel -= gravity;
        }

        return;
    }
}

const dinosaur = new Dinosaur();

document.addEventListener("click", (e) => {
    // todo: add spacebar to jump
    dinosaur.jump();
})

function gameLoop(t) {

    t += 0.1;
    dinosaur.update();
    clockElement.textContent = "time: " + t;
    jumpElement.textContent = "height: " + dinosaur.y + ". Vel: " + dinosaur.vel;

    // loop
    window.requestAnimationFrame((t) => gameLoop(t));
}

gameLoop(tick);