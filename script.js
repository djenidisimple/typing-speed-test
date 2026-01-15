import { valueText } from "./src/load.js";
// import { countWord, generateBackground, timeRun, writeText } from "./src/utils.js";
import { generateBackground } from "./src/utils.js";

let background = document.createElement("div");
let body = document.body, span, textUser = [], color = "";
let content = document.querySelector(".content");
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
let text = valueText[localStorage.getItem('difficulty') || "easy"], textValue = [];
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d"), pLine = 0, count = 0;

time.innerText = (localStorage.getItem('mode') == "timed(60s)") ? "60" : "00";
background.className = "background";
body.appendChild(background);
wpm.forEach((value) => value.innerText = "0");
acc.forEach((value) => value.innerText = "100%");

resultat.style.display = "none";
generateBackground(background);

function getFontSize() {
    let baseFontSize = 20, scaleFactor = Math.min(canvas.width / 400, 1.5);
    return Math.max(baseFontSize, baseFontSize * scaleFactor);
}

function resizeCanvas() {
    const container = canvas.parentElement;
    const displayWidth = Math.floor(container.clientWidth);
    canvas.width = displayWidth;
    canvas.style.width = displayWidth + "px";
    let fontSize = getFontSize();
    let words = valueText[localStorage.getItem('difficulty') || "easy"].split(" ");
    let padding = 26, line = "", lineHeight = padding * 1.4;
    let y = padding + fontSize, maxWidth = canvas.width - (padding * 2);
    let tempCanvas = document.createElement("canvas");
    let tempCtx = tempCanvas.getContext("2d");
    tempCtx.font = `${fontSize}px serif`;
    
    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i];
        let metrics = tempCtx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
            line = words[i] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    let needHeight = y + padding + lineHeight;
    if (Math.abs(canvas.height - needHeight) > 5) {
        canvas.height = needHeight;
        canvas.style.height = needHeight + "px";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function renderText() {
    textValue = [];
    let count = 0
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let fontSize = getFontSize();
    let words = valueText[localStorage.getItem('difficulty') || "easy"].split(" ");
    let padding = 26, line = "", lineHeight = padding * 1.4;
    let x = padding, y = padding + fontSize, maxWidth = canvas.width - (padding * 2);
    ctx.font = `${fontSize}px serif`;
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
            line = words[i] + " ";
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
    let i = 0, j = 0, end = false;
    while (i <= count) {
        let charX = textValue[i].x;
        while (j < textValue[i].text.length) {
            let char = textValue[i].text[j];
            if (i == pLine && j >= cursor) {
                end = true;
            } 
            if (end) {
                ctx.fillStyle = "white";
            } else {
                ctx.fillStyle = "green";
            }
            ctx.fillText(char, charX, textValue[i].y);
            charX += ctx.measureText(char).width;
            j++;
        }
        i++;
        j = 0;
    }
    drawCusor();
}

function drawCusor() {
    let cursorX = textValue[pLine].x;
    for (let i = 0; i < cursor; i++) {
        cursorX += ctx.measureText(textValue[pLine].text[i]).width;
    }
    let currrentText = textValue[pLine].text[cursor] || " ";
    let charWidth = ctx.measureText(currrentText).width;
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fillRect(
        cursorX, 
        textValue[pLine].y - getFontSize() + 4, 
        charWidth, 
        getFontSize()
    );
}

resizeCanvas();
renderText();

document.addEventListener("keydown", function(e) {
    let regex = /[a-zA-Z0-9@.,/?&!#$%^&*()=-`~'";<>\\|\[\]{}\e]/;    
    if (e.key.length === 1 && (regex.test(e.key) || e.keyCode == 32) && cursor >= 0 && start) {
        cursor++;
        if (textValue[pLine].text[cursor] == undefined && pLine < count) {
            pLine++;
            cursor = 0;
        }
        renderText();
    }
    // if (e.key.length === 1 && (regex.test(e.key) || e.keyCode == 32) && cursor >= 0 && start) {
    //     textUser.push(e.key);
    //     wpm.forEach((value) => value.innerText = countWord(textUser));
    //     color = (e.key == text.split("")[cursor]) ? "var(--green-500)" : "var(--red-500)";
    //     span[cursor].style.color = color;
    //     if (cursor + 1 == text.split("").length) {
    //         main.style.display = "none";
    //         resultat.style.display = "block";
    //         footer.classList.remove("border-t");
    //     } else {
    //         span[cursor].classList.remove("pointer");
    //         if (color == "var(--red-500)") span[cursor].style.textDecoration = "underline";
    //         cursor++;
    //         span[cursor].classList.add("pointer");
    //     }
    // } else if ((e.key == "Backspace" || e.key == "Delete") && cursor > 0 && start) {
    //     span[cursor].classList.remove("pointer");
    //     span[cursor - 1].style.color = "var(--neutral-400)";
    //     span[cursor - 1].style.textDecoration = "none";
    //     textUser.pop()
    //     cursor = (cursor > 0) ? cursor - 1 : 0;
    //     span[cursor].classList.add("pointer");
    // }
});

btnStart.addEventListener("click", () => {
    start = true;
    document.querySelector(".container-start").style.display = "none";
    document.querySelector("footer").classList.remove("display-none");
    canvas.classList.remove("effet-blur");
    // timeRun(timeInterval, time, main, footer, resultat, start);
});

// restart.addEventListener("click", function() {
//     textUser = [];
//     span[cursor].classList.remove("pointer");
//     span[cursor].style.textDecoration = "none";
//     resultat.style.display = "none";
//     cursor = 0;
//     span.forEach(value => {value.style.color = "var(--neutral-400)"});
//     main.style.display = "block";
//     footer.classList.add("border-t");
//     span[cursor].classList.add("pointer");
//     time.innerText = "60";
//     wpm.forEach((value) => value.innerText = "0")
// });

// btnMode.forEach((value, id) => {
//     if (localStorage.getItem('mode') == "timed(60s)" && id % 2 == 0) {
//         btnMode.forEach(v => v.classList.remove("border-blue-400"));
//         value.classList.add("border-blue-400");
//         time.innerText = "60";
//     } else if (localStorage.getItem('mode') == "passage" && id % 2 != 0) {
//         btnMode.forEach(v => v.classList.remove("border-blue-400"));
//         value.classList.add("border-blue-400");
//         time.innerText = "00";
//     }
//     value.addEventListener("click", function() {
//         btnMode.forEach(v => v.classList.remove("border-blue-400"));
//         value.classList.add("border-blue-400");
//         if (id % 2 == 0) {
//             localStorage.setItem('mode', "timed(60s)");
//             time.innerText = "60";
//             timeRun(timeInterval, time, main, footer, resultat, start);
//         } else {
//             localStorage.setItem('mode', 'passage');
//             time.innerText = "00";
//         }
//     });
// });



// btnD.forEach((value, id) => {
//     if (localStorage.getItem('difficulty') == "easy" && id == 0) {
//         btnD.forEach(v => v.classList.remove("border-blue-400"));
//         value.classList.add("border-blue-400");
//     } else if (localStorage.getItem('difficulty') == "medium" && id == 1) {
//         btnD.forEach(v => v.classList.remove("border-blue-400"));
//         value.classList.add("border-blue-400");
//     } else if (localStorage.getItem('difficulty') == "hard" && id == 2) {
//         btnD.forEach(v => v.classList.remove("border-blue-400"));
//         value.classList.add("border-blue-400");
//     }
//     value.addEventListener("click", function() {
//         btnD.forEach(v => v.classList.remove("border-blue-400"));
//         value.classList.add("border-blue-400");
//         if (id == 0) {
//             localStorage.setItem('difficulty', 'easy');
//         } else if (id == 1) {
//             localStorage.setItem('difficulty', 'medium');
//         } else {
//             localStorage.setItem('difficulty', 'hard');
//         }
//         writeText(valueText[localStorage.getItem('difficulty')], content);
//     });
// });

// selected.forEach((element, id) => {
//     element.addEventListener("click", () => {
//         if (option[id].style.display == "flex") {
//             option[id].style.display = "none";
//             iconSelected[id].classList.remove("selected-active");
//         } else {
//             option[id].style.display = "flex";
//             iconSelected[id].classList.add("selected-active");
//         }
//     });
// });

// mode.forEach((element) => {
//     checked(element);
//     element.addEventListener("click", () => {
//         checked(element, "click");
//     });
// });

// level.forEach((element) => {
//     checked(element, null, "difficulty");
//     element.addEventListener("click", () => {
//         checked(element, "click", "difficulty");
//     });
// });

// function checked(element, event=null, type="mode") {
//     if (event == "click") {
//         localStorage.setItem(type, element.value);
//     }
//     if (element.value == localStorage.getItem(type)) {
//         mode.forEach((value) => value.checked = false);
//         element.checked = true;
//         document.querySelector(`.label-${type}-input`).innerText = (element.value);
//         document.querySelector(`.label-${type}-input`).style.textTransform = "capitalize";
//         if (element.value == "timed(60s)") {
//             time.innerText = "60";
//         } else if (element.value == "passage") {
//             time.innerText = "00";
//         }
//     }
// }
