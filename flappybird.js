const bird = document.getElementById("bird");
const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
const skyOverlay = document.getElementById("skyOverlay");

const gameOverCard = document.getElementById("gameOverCard");
const finalScoreText = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");

/* NAME POPUP */
const namePopup = document.getElementById("namePopup");
const playerNameInput = document.getElementById("playerNameInput");
const saveScoreBtn = document.getElementById("saveScoreBtn");

/* SOUNDS */
const flapSound = new Audio("flap.mp3");
const hitSound = new Audio("flappy-bird-hit-sound.mp3");
const dieSound = new Audio("die.mp3");
const pointSound = new Audio("point.mp3");

let birdY = 250;
let velocity = 0;
let gravity = 0.6;
let jumpPower = -10;

let gameRunning = true;
let score = 0;

let pipeGap = 230;
let pipeSpeed = 4;


/* SAVE SCORE FUNCTION */
function saveScore(name, score) {

    let scores = JSON.parse(localStorage.getItem("flappyScores")) || [];

    scores.push({
        name: name,
        score: score
    });

    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 15);

    localStorage.setItem("flappyScores", JSON.stringify(scores));
}


/* JUMP FUNCTION */
function flap() {

    if (gameRunning) {

        velocity = jumpPower;

        flapSound.currentTime = 0;
        flapSound.play();

        bird.style.transform = "rotate(-20deg)";

        setTimeout(() => {
            bird.style.transform = "rotate(0deg)";
        }, 100);

    }

}


/* CONTROLS */

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") flap();
});

game.addEventListener("touchstart", (e) => {
    e.preventDefault();
    flap();
});

game.addEventListener("mousedown", flap);


/* CREATE PIPE (FIXED) */

function createPipe() {

    let pipeTop = document.createElement("img");
    let pipeBottom = document.createElement("img");

    pipeTop.src = "bird-pipe.png";
    pipeBottom.src = "bird-pipe.png";

    pipeTop.classList.add("pipe");
    pipeBottom.classList.add("pipe");

    let gameHeight = game.clientHeight;

    /* RANDOM GAP POSITION */

    let gapPosition = Math.floor(Math.random() * (gameHeight - pipeGap - 200)) + 100;

    /* TOP PIPE */

    pipeTop.style.height = gapPosition + "px";
    pipeTop.style.left = game.clientWidth + "px";
    pipeTop.style.top = "0px";
    pipeTop.style.transform = "rotate(180deg)";

    /* BOTTOM PIPE */

    pipeBottom.style.height = (gameHeight - gapPosition - pipeGap) + "px";
    pipeBottom.style.left = game.clientWidth + "px";
    pipeBottom.style.bottom = "0px";

    game.appendChild(pipeTop);
    game.appendChild(pipeBottom);

    let move = setInterval(() => {

        if (!gameRunning) {
            clearInterval(move);
            return;
        }

        let pipeLeft = parseInt(pipeTop.style.left);

        pipeTop.style.left = pipeLeft - pipeSpeed + "px";
        pipeBottom.style.left = pipeLeft - pipeSpeed + "px";

        let birdRect = bird.getBoundingClientRect();
        let topRect = pipeTop.getBoundingClientRect();
        let bottomRect = pipeBottom.getBoundingClientRect();

        /* COLLISION */

        if (
            birdRect.right > topRect.left &&
            birdRect.left < topRect.right &&
            (
                birdRect.top < topRect.bottom ||
                birdRect.bottom > bottomRect.top
            )
        ) {
            endGame();
        }

        /* SCORING */

        let pipeWidth = 150;
        let birdLeft = 120;

        if (!pipeTop.passed && pipeLeft + pipeWidth < birdLeft) {

            score++;
            scoreDisplay.textContent = score;
            pipeTop.passed = true;

            scoreDisplay.classList.add("score-pop");

            setTimeout(() => {
                scoreDisplay.classList.remove("score-pop");
            }, 300)

            pointSound.currentTime = 0;
            pointSound.play();

            /* NIGHT TRANSITION */

            if (score >= 10 && score <= 12) {

                let progress = (score - 10) / 2;

                skyOverlay.style.opacity = progress;

                if (progress > 0.3) {
                    document.body.classList.add("night");
                }

            }

            if (score > 12 && score < 20) {
                skyOverlay.style.opacity = 1;
            }

            /* DAY TRANSITION */

            if (score >= 20 && score <= 22) {

                let progress = (22 - score) / 2;

                skyOverlay.style.opacity = progress;

                if (progress < 0.7) {
                    document.body.classList.remove("night");
                }

            }

            /* SPEED */

            if (score >= 15) pipeSpeed = 5;
            if (score >= 25) pipeSpeed = 6;

        }

        if (pipeLeft < -200) {

            pipeTop.remove();
            pipeBottom.remove();
            clearInterval(move);

        }

    }, 20)

}


/* GAME OVER */

function endGame() {

    if (!gameRunning) return;

    gameRunning = false;

    hitSound.currentTime = 0;
    hitSound.play();

    setTimeout(() => {
        dieSound.currentTime = 0;
        dieSound.play();
    }, 150)

    bird.style.transform = "translateX(-40px) rotate(-50deg)";

    setTimeout(() => {

        namePopup.style.display = "block";

        saveScoreBtn.onclick = function () {

            let playerName = playerNameInput.value;

            if (playerName) {

                saveScore(playerName, score);

                namePopup.style.display = "none";

                finalScoreText.innerText = score;

                gameOverCard.style.display = "block";

            }

        }

    }, 400)

}


/* GAME LOOP */

function gameLoop() {

    if (!gameRunning) return;

    velocity += gravity;
    birdY += velocity;

    bird.style.top = birdY + "px";

    if (birdY > game.clientHeight - 160) endGame();
    if (birdY < 0) endGame();

    requestAnimationFrame(gameLoop);

}


/* PIPE SPAWN */

setInterval(() => {

    if (gameRunning) {
        createPipe();
    }

}, 2000);


gameLoop();


restartBtn.addEventListener("click", () => {
    location.reload();
});

homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});