let gameSeq = [];
let userSeq = [];
let isStarted = false;
let canRestart = true;
let level = 0;
let highScore = 0;

let btns = ["red", "green", "blue", "yellow"];

let h2 = document.querySelector("h2");

document.addEventListener("keypress", function(e) {
    if (e.key === "Enter" && !isStarted && canRestart) {
        e.preventDefault();
        isStarted = true;
        console.log("Game started!");
        level = 0;
        gameSeq = [];
        userSeq = [];
        nextLevel();
    }
});

function btnFlash(btn) {
    btn.classList.add("flash");
    setTimeout(() => {
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn) {
    btn.classList.add("userFlash");
    setTimeout(() => {
        btn.classList.remove("userFlash");
    }, 250);
}

function nextLevel() {
    userSeq = []; // Reset user sequence for the new level
    level++;
    h2.innerText = `Level ${level}`;
    let randBtn = btns[Math.floor(Math.random() * 4)];
    let randbtn = document.getElementById(randBtn);
    gameSeq.push(randBtn);
    console.log(gameSeq);
    btnFlash(randbtn);
}

let allBtns = document.querySelectorAll(".btn");
for (let btn of allBtns) {
    btn.addEventListener("click",btnPress);
}

function btnPress() {
    let btn = this;
    userFlash(btn);

    let userColor = btn.getAttribute("id");
    console.log(userColor);
    userSeq.push(userColor);

    checkSeq(userSeq.length - 1);
}

function checkSeq(idx) {
    // console.log("Current level: " + level);
    // let idx = level - 1;
    if (userSeq[idx] === gameSeq[idx]) {
        // console.log("Correct!");
        if (userSeq.length === gameSeq.length) {
            setTimeout(nextLevel, 1000);
        }
    } else {
        if (level > highScore) highScore = level;
        document.getElementById("high-score").innerText = `High Score: ${highScore}`;
        let finalScore = level;
        h2.innerHTML = `Game Over! Your score is <b>${finalScore}</b>. 
                        <div>Press <b>Enter</b> to play again.</div>`;
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(() => {
            document.querySelector("body").style.backgroundColor = "";
        }, 250);
        reset();
    }
}

function reset() {
    canRestart = false;
    isStarted = false;
    level = 0;
    gameSeq = [];
    userSeq = [];
    setTimeout(() => {
        canRestart = true;
    }, 1000);
}