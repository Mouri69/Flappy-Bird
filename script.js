const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let birdY = canvas.height / 2;
let birdX = 50;
let gravity = 0.5;
let lift = -10;
let birdVelocity = 0;
let pipeWidth = 30; // Smaller pipe width
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
        ctx.drawImage(pipeTopImg, pipes[i].x, pipes[i].y - pipeTopImg.height);
        ctx.drawImage(pipeBottomImg, pipes[i].x, pipes[i].y + pipeGap);

        // More precise collision detection
        const birdWidth = 30; // Adjusted hitbox width
        const birdHeight = 30; // Adjusted hitbox height
        const pipeTopHeight = pipeTopImg.height;
        const pipeBottomY = pipes[i].y + pipeGap;

        // Check for collision with top pipe
        if (
            birdX + birdWidth > pipes[i].x && 
            birdX < pipes[i].x + pipeWidth &&
            birdY < pipes[i].y
        ) {
            gameOver = true;
        }

        // Check for collision with bottom pipe
        if (
            birdX + birdWidth > pipes[i].x && 
            birdX < pipes[i].x + pipeWidth &&
            birdY + birdHeight > pipeBottomY
        ) {
            gameOver = true;
        }

        // Check if the bird hits the ground or ceiling
        if (birdY + birdHeight > canvas.height || birdY < 0) {
            gameOver = true;
        }

        // If the game is over, show an alert with the final score
        if (gameOver) {
            alert("Game Over! Your Score: " + score);
            return;
        }

        // Increase score when the bird passes a pipe
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

// Draw hitboxes for debugging
ctx.strokeStyle = 'red';
const birdWidth = 20; // Adjusted hitbox width
const birdHeight = 20; // Adjusted hitbox height
const pipeTopHeight = pipeTopImg.height;
let i = 0;
const pipeBottomY = pipes[i].y + pipeGap;


ctx.strokeRect(birdX, birdY, birdWidth, birdHeight); // Bird hitbox
ctx.strokeRect(pipes[i].x, pipes[i].y - pipeTopImg.height, pipeWidth, pipeTopImg.height); // Top pipe hitbox
ctx.strokeRect(pipes[i].x, pipeBottomY, pipeWidth, canvas.height - pipeBottomY); // Bottom pipe hitbox

