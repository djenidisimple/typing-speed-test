import { getText, writeText } from "./src/utils.js";

let background = document.createElement("div");
let div, body = document.body, span, textUser = [], color = "";
let content = document.querySelector(".content");
let cursor = (textUser.length - 1 < 0) ? 0 : textUser.length - 1;
let restart = document.querySelector(".btn-restart");
let main = document.querySelector("main"), footer = document.querySelector("footer");
let time = document.querySelector(".time");
let resultat = document.querySelector(".resultat");
let btnMode = document.querySelectorAll(".btn-mode");
let btnD = document.querySelectorAll(".btn-d");
let timeInterval = null;
let data = await getText();
let text = data[localStorage.getItem('difficulty') || "easy"];

time.innerText = (localStorage.getItem('mode') == "timed") ? "60" : "00";
background.className = "background";
body.appendChild(background);
writeText(text, content);

resultat.style.display = "none";
span = document.querySelectorAll("span.text");
span[0].classList.add("pointer");

// background
for (let i = 0; i < 12; i++) {
    div = document.createElement("div");
    div.className = "items";
    background.appendChild(div);
}

document.addEventListener("keydown", function(e) {
    let regex = /[a-zA-Z0-9@.,/?&!#$%^&*()=-`~'";<>\\|\[\]{}\e]/;    
    if (e.key.length === 1 && (regex.test(e.key) || e.keyCode == 32) && cursor >= 0) {
        textUser.push(e.key);
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
    } else if ((e.key == "Backspace" || e.key == "Delete") && cursor > 0) {
        span[cursor].classList.remove("pointer");
        span[cursor - 1].style.color = "var(--neutral-400)";
        span[cursor - 1].style.textDecoration = "none";
        textUser.pop()
        cursor = (cursor > 0) ? cursor - 1 : 0;
        span[cursor].classList.add("pointer");
    }
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
});

btnMode.forEach((value, id) => {
    if (localStorage.getItem('mode') == "timed" && id % 2 == 0) {
        btnMode.forEach(v => v.classList.remove("border-blue-400"));
        value.classList.add("border-blue-400");
    } else if (localStorage.getItem('mode') == "passage" && id % 2 != 0) {
        btnMode.forEach(v => v.classList.remove("border-blue-400"));
        value.classList.add("border-blue-400");
    }
    value.addEventListener("click", function() {
        btnMode.forEach(v => v.classList.remove("border-blue-400"));
        value.classList.add("border-blue-400");
        if (id % 2 == 0) {
            localStorage.setItem('mode', "timed");
            time.innerText = "60";
            timeRun();
        } else {
            localStorage.setItem('mode', 'passage');
            time.innerText = "00";
        }
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
        writeText(data[localStorage.getItem('difficulty')], content);
    });
});

function timeRun() {

    if (timeInterval) {
        clearInterval(timeInterval);
    }

    timeInterval = setInterval(() => {
        if (localStorage.getItem('mode') != "timed") {
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

timeRun();
