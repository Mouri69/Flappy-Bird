const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let birdY = canvas.height / 2;
let birdX = 50;
let gravity = 0.5;
let lift = -10;
let birdVelocity = 0;
let pipeWidth = 150; // Width of the pipe image
let pipeGap = 250; // Gap between top and bottom pipes
let pipes = [];
let score = 0;
let gameOver = false;
let gameStarted = false; // Game does not start until space is pressed

// Load bird image
const birdImg = new Image();
birdImg.src = 'images/bird.png'; // Use the actual path to your bird image

// Load pipe images
const pipeTopImg = new Image();
pipeTopImg.src = 'images/pipetop.png'; // Use the actual path to your top pipe image
const pipeBottomImg = new Image();
pipeBottomImg.src = 'images/pipebottom.png'; // Use the actual path to your bottom pipe image

// Bird jump function
function jump() {
    birdVelocity = lift;
}

// Key press event
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!gameStarted) {
            gameStarted = true;
            gameLoop(); // Start the game loop on spacebar press
        } else if (!gameOver) {
            jump();
        }
    }
});

// Create initial pipes
function createInitialPipes() {
    pipes.push({
        x: canvas.width,
        y: Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50
    });
}

// Game loop
function gameLoop() {
    if (gameOver) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird logic
    birdVelocity += gravity;
    birdY += birdVelocity;
    ctx.drawImage(birdImg, birdX, birdY, 40, 40);

    // Pipe logic
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2; // Move pipe to the left

        // Draw pipes
        ctx.drawImage(pipeTopImg, pipes[i].x-37, pipes[i].y - pipeTopImg.height);
        ctx.drawImage(pipeBottomImg, pipes[i].x-37, pipes[i].y + pipeGap);

        // Debug: Log dimensions for pipes
        console.log(`Pipe Top Image Dimensions: ${pipeTopImg.width}x${pipeTopImg.height}`);
        console.log(`Pipe Bottom Image Dimensions: ${pipeBottomImg.width}x${pipeBottomImg.height}`);

        // Collision detection
        if (
            (birdX < pipes[i].x + pipeWidth &&
            birdX + 40 > pipes[i].x &&
            (birdY < pipes[i].y || birdY + 40 > pipes[i].y + pipeGap)) ||
            birdY + 40 > canvas.height || birdY < 0
        ) {
            gameOver = true;
            alert("Game Over! Your Score: " + score);
            return;
        }

        // Increase score
        if (pipes[i].x + pipeWidth < birdX && !pipes[i].scored) {
            score++;
            pipes[i].scored = true;
        }
    }

    // Add new pipes with enough space between them
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        pipes.push({
            x: canvas.width,
            y: Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50
        });
    }

    // Remove off-screen pipes
    if (pipes[0].x < -pipeWidth) {
        pipes.shift();
    }

    // Draw hitboxes for debugging
    ctx.strokeStyle = 'red';
    const birdWidth = 40; // Bird width
    const birdHeight = 40; // Bird height

    // Draw bird hitbox
    ctx.strokeRect(birdX, birdY, birdWidth, birdHeight); // Bird hitbox

    // Draw pipe hitboxes
    pipes.forEach(pipe => {
        // Top pipe hitbox
        ctx.strokeRect(pipe.x, pipe.y - pipeTopImg.height, pipeWidth, pipeTopImg.height); // Top pipe hitbox
        // Bottom pipe hitbox
        ctx.strokeRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - (pipe.y + pipeGap)); // Bottom pipe hitbox
    });

    // Loop the game
    requestAnimationFrame(gameLoop);
}

// Initial draw (so the bird is visible before starting)
function initialDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(birdImg, birdX, birdY, 40, 40);
}

initialDraw(); // Draw the initial state
createInitialPipes(); // Set up initial pipes
