let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
const canvas = document.getElementById('confetti');
const context = canvas.getContext("2d");
const maxConfettis = 1000;
const confettiParticles = [];

const possibleColors = [
    "#ffcc00",
    "#ff6666",
    "#ff99cc",
    "#cc99ff",
    "#66ccff",
    "#99ffcc"
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function ConfettiParticle() {
    this.x = Math.random() * screenWidth;
    this.y = Math.random() * screenHeight;
    this.radius = getRandomInt(5, 12);
    this.color = possibleColors[getRandomInt(0, possibleColors.length - 1)];
    this.velocityX = getRandomInt(-8, 8);
    this.velocityY = getRandomInt(-12, -6);
    this.rotation = getRandomInt(0, 360);

    this.draw = function () {
        context.beginPath();
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation * Math.PI / 180);
        context.fillStyle = this.color;
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
        context.closePath();
    };
}

function drawConfetti() {
    requestAnimationFrame(drawConfetti);

    context.clearRect(0, 0, screenWidth, screenHeight);

    for (let i = 0; i < maxConfettis; i++) {
        confettiParticles[i].draw();
        confettiParticles[i].x += confettiParticles[i].velocityX;
        confettiParticles[i].y += confettiParticles[i].velocityY;

        if (confettiParticles[i].y > screenHeight) {
            confettiParticles[i].y = 0;
        }
    }
}

function closeModal() {
    const modalContainer = document.querySelector('.modal-container');
    modalContainer.style.display = 'none';
}

window.addEventListener(
    "resize",
    function () {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    },
    false
);

for (let i = 0; i < maxConfettis; i++) {
    confettiParticles.push(new ConfettiParticle());
}

canvas.width = screenWidth;
canvas.height = screenHeight;
drawConfetti();
