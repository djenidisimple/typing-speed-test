function countWord(time, i=0) {
    let word = document.querySelector(".wpm");
    let count = 0;
    
    if (i == 1 || i == -1) {
        count = (parseInt(word.textContent) == 0 && i == -1) ? 0 : parseInt(word.textContent) + i;
    }

    if (time <= 1) {
        return count;
    }
    return Math.floor((count * 12) / time);
}

function calculateAccuracy(totalWords, wrongWords) {
    const correctWords = totalWords - wrongWords;
    return Math.floor((correctWords / totalWords) * 100);
}

function updateScore(score) {
    let resultLogo = document.querySelectorAll(".resultLogo");
    let titleFinal = document.querySelector(".title-final");
    let pFinal = document.querySelector(".p-final");
    resultLogo.forEach((value) => {
        value.style.display = "none";
    });
    if (localStorage.getItem("bestScore")) {
        resultLogo.forEach((value, id) => {
            if (id == 1 && score.textContent > localStorage.getItem("bestScore")) {
                value.style.display = "block";
                score.innerText = localStorage.getItem("bestScore");
                document.querySelector(".header-result").classList.remove("p-2");
                titleFinal.innerText = "High Score Smashed!";
                pFinal.innerText = "You’re getting faster. That was incredible typing.";
            } else if (id == 0 && score.textContent <= localStorage.getItem("bestScore")) {
                value.style.display = "block";
                document.querySelector(".header-result").classList.add("p-2");
                if (id == 0 && score.textContent == 0) {
                    titleFinal.innerText = "Baseline Established!";
                    pFinal.innerText = "You’ve set the bar. Now the real challenge begins—time to beat it.";
                    score.innerText = localStorage.getItem("bestScore");
                } else {
                    titleFinal.innerText = "Test Complete!";
                    pFinal.innerText = "Solid run. Keep pushing to beat your high score.";
                }
            }
        });
    } else {
        resultLogo.forEach((value, id) => {
            if (id == 1) {
                score.innerText = localStorage.getItem("bestScore");
                value.style.display = "block";
                document.querySelector(".header-result").classList.add("p-2");
                titleFinal.innerText = "High Score Smashed!";
                pFinal.innerText = "You’re getting faster. That was incredible typing.";
            } else {
                value.style.display = "block";
                document.querySelector(".header-result").classList.remove("p-2");
                if (id == 0 && score.textContent == 0) {
                    titleFinal.innerText = "Baseline Established!";
                    pFinal.innerText = "You’ve set the bar. Now the real challenge begins—time to beat it.";
                }
            }
        });
    }
}

function getFontSize() {
    let canvas = document.querySelector("canvas");
    const width = canvas.width;
    if (width <= 400) {
    return 32;
    } else if (width <= 768) {
    return 36;
    } else if (width <= 1024) {
    return 38;
    } else {
    return 40;
    }
}

function calculeState(valueText, textWrong, i) {
    let text = valueText[localStorage.getItem('difficulty') || "easy"].split("");
    let wpmValue = countWord(localStorage.getItem('mode') == "timed(60s)" ? 60 : 1, i);
    let accuracy = calculateAccuracy(text.length, textWrong.length);
    let wpm = document.querySelectorAll(".wpm");
    let acc = document.querySelectorAll(".acc");
    wpm.forEach((value) => value.innerText = wpmValue);
    acc.forEach((value) => value.innerText = accuracy  + "%");
    if (accuracy <= 30) {
        acc[0].style.color = "var(--red-500)";
    } else {
        acc[0].style.color = "var(--neutral-0)";
    }
}

function formatedTime(seconds) {
    const mins = Math.floor(parseInt(seconds) / 60);
    const secs = parseInt(seconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function deFormatedTime(time) {
    const [mins, secs] = time.split(":").map(Number);
    return mins * 60 + secs;
}

function generateBackground(background) {
    for (let i = 0; i < 12; i++) {
        let div = document.createElement("div");
        div.className = "items";
        background.appendChild(div);
    }
}

function resultatFinal() {
    let btnRecord = document.querySelector(".record");
    let labelBtn = document.querySelector(".label-btn");
    btnRecord.classList.remove("btn-restart");
    btnRecord.classList.add("btn-beat");
    labelBtn.innerText = "Go Again";
}

export { countWord, formatedTime, deFormatedTime, resultatFinal, updateScore, getFontSize, calculeState, calculateAccuracy, generateBackground }