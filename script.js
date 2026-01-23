import { valueText } from "./src/load.js";
import { calculeState, countWord, deFormatedTime, formatedTime, generateBackground, getFontSize, resultatFinal, updateScore } from "./src/utils.js";

let background = document.createElement("div");
let body = document.body;
let restart = document.querySelector(".btn-restart");
let main = document.querySelector("main"), footer = document.querySelector("footer");
let time = document.querySelector(".time");
let resultat = document.querySelector(".resultat");
let btnMode = document.querySelectorAll(".btn-mode");
let mode = document.querySelectorAll(".mode-input");
let level = document.querySelectorAll(".level-input");
let btnD = document.querySelectorAll(".btn-d"), btnStart = document.querySelector(".btn-start");
let timeInterval = null, wpm = document.querySelectorAll(".wpm"), acc = document.querySelectorAll(".acc");
let selected = document.querySelectorAll(".selected");
let iconSelected = document.querySelectorAll(".icon-selected");
let option = document.querySelectorAll(".option");
let cursor = 0;
let start = false;
let textValue = [], textUser = [], textWrong = [];
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d"), pLine = 0, countLine = 0, stop = false;
let char = document.querySelector(".char");
let score  = document.querySelector(".score");

// timeRun(timeInterval, time, main, footer, resultat, start, valueText[localStorage.getItem('difficulty') || "easy"].split(""), textWrong);

background.className = "background";
body.appendChild(background);
wpm.forEach((value) => value.innerText = "0");
acc.forEach((value) => value.innerText = "100%");
updateScore(score);
char.innerText = valueText[localStorage.getItem('difficulty') || "easy"].split("").length;
resultat.style.display = "none";
generateBackground(background);

function timeRun(time, main, footer, resultat, start) {

    if (timeInterval) {
        clearInterval(timeInterval);
    }
    
    if (start == true) {
        timeInterval = setInterval(() => {
            if (localStorage.getItem('mode') != "timed(60s)") {
                time.innerText = formatedTime("0");
                clearInterval(timeInterval);
                return;
            }
            time.innerText = deFormatedTime(time.textContent) > 0 ? formatedTime(deFormatedTime(time.textContent) - 1) : formatedTime(0);
            if (time.textContent == formatedTime("0")) {
                main.style.display = "none";
                footer.classList.remove("border-t");
                resultat.style.display = "block";
            }
        }, 1000);
    } else {
        clearInterval(timeInterval);
    }
}

function resizeCanvas() {
    const container = canvas.parentElement;
    const displayWidth = Math.floor(container.clientWidth);
    canvas.width = displayWidth;
    canvas.style.width = displayWidth + "px";
    let fontSize = getFontSize();
    let words = valueText[localStorage.getItem('difficulty') || "easy"].split(" ");
    let line = "", lineHeight = fontSize * 1.36;
    let padding = 32; 
    let y = padding + fontSize, maxWidth = canvas.width - 20;
    let tempCanvas = document.createElement("canvas");
    let tempCtx = tempCanvas.getContext("2d");
    tempCtx.font = `${fontSize}px Sora`;
    
    for (let i = 0; i < words.length; i++) {
        let testLine = line + (line ? " " : "") + words[i];
        let metrics = tempCtx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
            line = words[i] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    let needHeight = y + lineHeight;
    if (Math.abs(canvas.height - needHeight) > 5) {
        canvas.height = needHeight;
        canvas.style.height = needHeight + "px";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function renderText() {
    textValue = [];
    let count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let fontSize = getFontSize();
    let words = valueText[localStorage.getItem('difficulty') || "easy"].split(" ");
    let line = "", lineHeight = fontSize * 1.36;
    let padding = 32;
    let x = 5, y = padding + fontSize, maxWidth = canvas.width - 20;
    ctx.font = `${fontSize}px Sora`;
    for (let i = 0; i < words.length; i++) {
        let testLine = line + (line ? " " : "") + words[i];
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== "") {
            textValue.push({
                text: line,
                x: x,
                y: y,
                width: ctx.measureText(line).width,
            });
            line = words[i];
            y += lineHeight;
            count++;
        } else {
            line = testLine;
        }
    }
    if(line) {
        textValue.push({
            text: line,
            x: x,
            y: y,
            width: ctx.measureText(line).width,
        });
    }
    let i = 0, j = 0, k = 0, end = false, colorText = "";
    while (i <= count) {
        let charX = textValue[i].x;
        while (j < textValue[i].text.length) {
            let char = textValue[i].text[j];
            if (i == pLine && j >= cursor) {
                end = true;
            } 
            if (end) {
                colorText = "#949497";
            } else {
                colorText = (char == textUser[k]) ? "#4DD67B" : "rgba(214, 77, 91, 1)";
                k++;
            }
            ctx.fillStyle = colorText;
            ctx.fillText(char, charX, textValue[i].y);
            if (colorText == "rgba(214, 77, 91, 1)") {
                ctx.beginPath();
                let charWidth = ctx.measureText(char).width;
                ctx.rect(charX, textValue[i].y + fontSize * 0.2, charWidth, 3);
                ctx.fill();
            }
            charX += ctx.measureText(char).width;
            j++;
        }
        i++;
        j = 0;
    }
    countLine = count;
    drawCusor();
}

function drawCusor() {
    let cursorX = textValue[pLine].x;
    for (let i = 0; i < cursor; i++) {
        cursorX += ctx.measureText(textValue[pLine].text[i]).width;
    }
    let currrentText = textValue[pLine].text[cursor] || " ";
    let charWidth = ctx.measureText(currrentText).width;
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.roundRect(
        cursorX, 
        textValue[pLine].y - getFontSize() + 4, 
        charWidth, 
        getFontSize(), 
        5
    );
    ctx.fill();
}


resizeCanvas();
renderText();

window.addEventListener("resize", () => {
    resizeCanvas();
    renderText();
});

document.addEventListener("keydown", function(e) {
    let regex = /[a-zA-Z0-9@.,/?&!#$%^&*()=-`~'";<>\\|\[\]{}\e]/;    
    if (e.key.length === 1 && (regex.test(e.key) || e.keyCode == 32) && cursor >= 0 && start) {
        if (!stop) {
            if (textValue[pLine].text[cursor] != e.key) {
                textWrong.push(e.key);
                calculeState(valueText, textWrong, -1);
            } else {
                calculeState(valueText, textWrong, 1);
            }
            textUser.push(e.key);
            cursor++;
            if (textValue[pLine].text[cursor] == undefined && pLine < countLine) {
                pLine++;
                cursor = 0;
            }
            if (pLine >= countLine && cursor == textValue[pLine].text.length) {
                if (parseInt(score.textContent) < parseInt(wpm[0].textContent)) {
                    localStorage.setItem("bestScore", wpm[0].textContent);
                }
                updateScore(score);
                stop = true;
                main.style.display = "none";
                resultat.style.display = "flex";
                resultatFinal();
            }
            renderText();
        }
    } else if ((e.key == "Backspace" || e.key == "Delete") && cursor > 0 && start) {
        textUser.pop()
        cursor = (cursor > 0) ? cursor - 1 : 0;
        renderText();
    }
});

btnStart.addEventListener("click", () => {
    start = true;
    document.querySelector(".container-start").style.display = "none";
    document.querySelector(".blur").classList.add("border-b");
    document.querySelector("footer").classList.remove("display-none");
    canvas.classList.remove("effet-blur");
    let wpmValue = countWord(textValue, textWrong, parseInt(time.textContent));
    wpm.forEach((value) => value.innerText = "0");
    timeRun(time, main, footer, resultat, start);
    calculeState(valueText, textWrong);
});

restart.addEventListener("click", function() {
    let labelBtn = document.querySelector(".label-btn");
    let btnRecord = document.querySelector(".record");
    resultat.style.display = "none";
    cursor = 0, pLine = 0, stop = false;
    start = false;
    main.style.display = "block";
    time.innerText = formatedTime("60");
    timeRun(time, main, footer, resultat, start);
    wpm.forEach((value) => value.innerText = "0");
    document.querySelector(".container-start").style.display = "flex";
    document.querySelector(".blur").classList.remove("border-b");
    document.querySelector("footer").classList.add("display-none");
    canvas.classList.add("effet-blur");
    renderText();
    btnRecord.classList.remove("btn-beat");
    btnRecord.classList.add("btn-restart");
    labelBtn.innerText = "Restart Test";
});

btnMode.forEach((value, id) => {
    if (localStorage.getItem('mode') == "timed(60s)" && id % 2 == 0) {
        btnMode.forEach(v => v.classList.remove("border-blue-400"));
        value.classList.add("border-blue-400");
        time.innerText = formatedTime("60");
    } else if (localStorage.getItem('mode') == "passage" && id % 2 != 0) {
        btnMode.forEach(v => v.classList.remove("border-blue-400"));
        value.classList.add("border-blue-400");
        time.innerText = formatedTime("0");
    }
    value.addEventListener("click", function() {
        btnMode.forEach(v => v.classList.remove("border-blue-400"));
        value.classList.add("border-blue-400");
        if (id % 2 == 0) {
            localStorage.setItem('mode', "timed(60s)");
            time.innerText = formatedTime("60");
        } else {
            localStorage.setItem('mode', 'passage');
            time.innerText = formatedTime("0");
        }
        resizeCanvas();
        renderText();
    });
});



btnD.forEach((value, id) => {
    if (localStorage.getItem('difficulty') == "easy" && id == 0) {
        btnD.forEach(v => v.classList.remove("border-blue-400"));
        value.classList.add("border-blue-400");
    } else if (localStorage.getItem('difficulty') == "medium" && id == 1) {
        btnD.forEach(v => v.classList.remove("border-blue-400"));
        value.classList.add("border-blue-400");
    } else if (localStorage.getItem('difficulty') == "hard" && id == 2) {
        btnD.forEach(v => v.classList.remove("border-blue-400"));
        value.classList.add("border-blue-400");
    }
    value.addEventListener("click", function() {
        btnD.forEach(v => v.classList.remove("border-blue-400"));
        value.classList.add("border-blue-400");
        if (id == 0) {
            localStorage.setItem('difficulty', 'easy');
        } else if (id == 1) {
            localStorage.setItem('difficulty', 'medium');
        } else {
            localStorage.setItem('difficulty', 'hard');
        }
        resizeCanvas();
        renderText();
    });
});

selected.forEach((element, id) => {
    element.addEventListener("click", () => {
        if (option[id].style.display == "flex") {
            option[id].style.display = "none";
            iconSelected[id].classList.remove("selected-active");
        } else {
            option[id].style.display = "flex";
            iconSelected[id].classList.add("selected-active");
        }
        resizeCanvas();
        renderText();
    });
});

mode.forEach((element) => {
    checked(element);
    element.addEventListener("click", () => {
        resizeCanvas();
        renderText();
        checked(element, "click");
    });
});

level.forEach((element) => {
    checked(element, null, "difficulty");
    element.addEventListener("click", () => {
        resizeCanvas();
        renderText();
        checked(element, "click", "difficulty");
    });
});

function checked(element, event=null, type="mode") {
    if (event == "click") {
        localStorage.setItem(type, element.value);
    }
    if (element.value == localStorage.getItem(type)) {
        mode.forEach((value) => value.checked = false);
        element.checked = true;
        document.querySelector(`.label-${type}-input`).innerText = (element.value);
        document.querySelector(`.label-${type}-input`).style.textTransform = "capitalize";
        if (element.value == "timed(60s)") {
            time.innerText = formatedTime("60");
        } else if (element.value == "passage") {
            time.innerText = formatedTime("0");
        }
    }
}
