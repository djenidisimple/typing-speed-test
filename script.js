import { countWord, generateBackground, getText, timeRun, writeText } from "./src/utils.js";

let background = document.createElement("div");
let body = document.body, span, textUser = [], color = "";
let content = document.querySelector(".content");
let cursor = (textUser.length - 1 < 0) ? 0 : textUser.length - 1;
let restart = document.querySelector(".btn-restart");
let main = document.querySelector("main"), footer = document.querySelector("footer");
let time = document.querySelector(".time");
let resultat = document.querySelector(".resultat");
let btnMode = document.querySelectorAll(".btn-mode");
let mode = document.querySelectorAll(".mode-input");
let level = document.querySelectorAll(".level-input");
let btnD = document.querySelectorAll(".btn-d"), btnStart = document.querySelector(".btn-start");
let timeInterval = null, wpm = document.querySelectorAll(".wpm"), acc = document.querySelectorAll(".acc");
let data = await getText();
let text = data[localStorage.getItem('difficulty') || "easy"];
let selected = document.querySelectorAll(".selected");
let iconSelected = document.querySelectorAll(".icon-selected");
let option = document.querySelectorAll(".option");
let start = false;

time.innerText = (localStorage.getItem('mode') == "timed") ? "60" : "00";
background.className = "background";
body.appendChild(background);
wpm.forEach((value) => value.innerText = "0");
acc.forEach((value) => value.innerText = "100%");
writeText(text, content);

resultat.style.display = "none";
span = generateBackground(background);

document.addEventListener("keydown", function(e) {
    let regex = /[a-zA-Z0-9@.,/?&!#$%^&*()=-`~'";<>\\|\[\]{}\e]/;    
    if (e.key.length === 1 && (regex.test(e.key) || e.keyCode == 32) && cursor >= 0 && start) {
        textUser.push(e.key);
        wpm.forEach((value) => value.innerText = countWord(textUser));
        color = (e.key == text.split("")[cursor]) ? "var(--green-500)" : "var(--red-500)";
        span[cursor].style.color = color;
        if (cursor + 1 == text.split("").length) {
            main.style.display = "none";
            resultat.style.display = "block";
            footer.classList.remove("border-t");
        } else {
            span[cursor].classList.remove("pointer");
            if (color == "var(--red-500)") span[cursor].style.textDecoration = "underline";
            cursor++;
            span[cursor].classList.add("pointer");
        }
    } else if ((e.key == "Backspace" || e.key == "Delete") && cursor > 0 && start) {
        span[cursor].classList.remove("pointer");
        span[cursor - 1].style.color = "var(--neutral-400)";
        span[cursor - 1].style.textDecoration = "none";
        textUser.pop()
        cursor = (cursor > 0) ? cursor - 1 : 0;
        span[cursor].classList.add("pointer");
    }
});

btnStart.addEventListener("click", () => {
    start = true;
    document.querySelector(".container-start").style.display = "none";
    document.querySelector("footer").classList.remove("display-none");
    content.classList.remove("effet-blur");
    timeRun(timeInterval, time, main, footer, resultat, start);
});

restart.addEventListener("click", function() {
    textUser = [];
    span[cursor].classList.remove("pointer");
    span[cursor].style.textDecoration = "none";
    resultat.style.display = "none";
    cursor = 0;
    span.forEach(value => {value.style.color = "var(--neutral-400)"});
    main.style.display = "block";
    footer.classList.add("border-t");
    span[cursor].classList.add("pointer");
    time.innerText = "60";
    wpm.forEach((value) => value.innerText = "0")
});

btnMode.forEach((value, id) => {
    if (localStorage.getItem('mode') == "timed(60s)" && id % 2 == 0) {
        btnMode.forEach(v => v.classList.remove("border-blue-400"));
        value.classList.add("border-blue-400");
        time.innerText = "60";
    } else if (localStorage.getItem('mode') == "passage" && id % 2 != 0) {
        btnMode.forEach(v => v.classList.remove("border-blue-400"));
        value.classList.add("border-blue-400");
        time.innerText = "00";
    }
    value.addEventListener("click", function() {
        btnMode.forEach(v => v.classList.remove("border-blue-400"));
        value.classList.add("border-blue-400");
        if (id % 2 == 0) {
            localStorage.setItem('mode', "timed(60s)");
            time.innerText = "60";
            timeRun(timeInterval, time, main, footer, resultat, start);
        } else {
            localStorage.setItem('mode', 'passage');
            time.innerText = "00";
        }
    });
});



btnD.forEach((value, id) => {
    console.log(localStorage.getItem('difficulty'));
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
        writeText(data[localStorage.getItem('difficulty')], content);
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
    });
});

mode.forEach((element) => {
    checked(element);
    element.addEventListener("click", () => {
        checked(element, "click");
    });
});

level.forEach((element) => {
    checked(element, null, "difficulty");
    element.addEventListener("click", () => {
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
            time.innerText = "60";
        } else {
            time.innerText = "00";
        }
    }
}
