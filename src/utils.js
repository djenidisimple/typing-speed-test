function countWord(word, wrong, time) {
    let count = word.length - wrong.length;
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
    if (localStorage.getItem("bestScore")) {
        score.innerText = localStorage.getItem("bestScore");
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

function calculeState(valueText, textWrong) {
    let text = valueText[localStorage.getItem('difficulty') || "easy"].split("");
    let wpmValue = countWord(text, textWrong, localStorage.getItem('mode') == "timed(60s)" ? 60 : 1);
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

function timeRun(timeInterval, time, main, footer, resultat, start, textValue, textWrong) {

    if (timeInterval) {
        clearInterval(timeInterval);
    }
    
    if (start == true) {
        timeInterval = setInterval(() => {
            if (localStorage.getItem('mode') != "timed(60s)") {
                time.innerText = "00";
                clearInterval(timeInterval);
                return;
            }
        
            time.innerText = (parseInt(time.textContent) > 0) ? parseInt(time.textContent) - 1 : 0;
            if (time.textContent == "0") {
                main.style.display = "none";
                footer.classList.remove("border-t");
                resultat.style.display = "block";
            }
        }, 1000);
    } else {
        clearInterval(timeInterval);
    }
}

function generateBackground(background) {
    for (let i = 0; i < 12; i++) {
        let div = document.createElement("div");
        div.className = "items";
        background.appendChild(div);
    }
}

export { countWord, updateScore, getFontSize, calculeState, calculateAccuracy, timeRun, generateBackground }