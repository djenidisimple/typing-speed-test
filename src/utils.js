function countWord(word) {
    let count = 0;
    for (let i = 0; i < word.length; i++) {
        count += (word[i] == " " || word[i] == ".") ? 1 : 0;
    }
    return count;
}

function timeRun(timeInterval, time, main, footer, resultat, start) {

    if (timeInterval) {
        clearInterval(timeInterval);
    }

    if (start) {
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