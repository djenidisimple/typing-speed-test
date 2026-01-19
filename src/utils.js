function countWord(word, wrong, time) {
    let count = word.length - wrong.length;
    return Math.floor((count * 12) / time);
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
            let timeValue = (localStorage.getItem('mode') == "timed(60s)") ? "60" : "00";
            let wpm = document.querySelectorAll(".wpm")
            let acc = document.querySelectorAll(".acc")
            let wpmValue = countWord(textValue, textWrong, parseInt(timeValue));
            let wpmMax = countWord(textValue, [], localStorage.getItem('mode') == "timed(60s)" ? 60 : 1);
            wpm.forEach((value) => value.innerText = wpmValue);
            acc.forEach((value) => value.innerText = Math.floor(wpmValue / wpmMax)  + "%");
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

export { countWord, timeRun, generateBackground }