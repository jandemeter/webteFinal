let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
const canvas = document.getElementById('confetti');
const context = canvas.getContext("2d");
const maxConfettis = 1000;
const confettiParticles = [];
const flagImages = [];

async function fetchData() {
    try {
        const response = await fetch("../data.json");
        const data = await response.json();

        // Assuming you have a specific region (e.g., Europe1) in mind
        const regionFlags = data.flags.Europe1;

        // Extract flag paths from the data
        regionFlags.forEach(flag => {
            const flagImage = new Image();
            flagImage.src = flag.flag;
            flagImages.push(flagImage);
        });

        // Shuffle flag images
        shuffleArray(flagImages);

        // Initialize confetti particles
        for (let i = 0; i < maxConfettis; i++) {
            confettiParticles.push(new ConfettiParticle());
        }

        // Other code remains the same...
        canvas.width = screenWidth;
        canvas.height = screenHeight;
        drawConfetti();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function ConfettiParticle() {
    this.x = Math.random() * screenWidth;
    this.y = Math.random() * screenHeight;
    this.radius = getRandomInt(15, 40); // Adjusted for slightly larger flags
    this.flagImage = flagImages[getRandomInt(0, flagImages.length - 1)];
    this.velocityX = getRandomInt(-8, 8);
    this.velocityY = getRandomInt(-12, -6);
    this.rotation = getRandomInt(0, 360);

    this.draw = function () {
        context.beginPath();
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation * Math.PI / 180);
        context.drawImage(this.flagImage, -this.radius / 2, -this.radius / 2, this.radius, this.radius);
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Call fetchData to initiate the confetti animation with larger flag images
fetchData();
