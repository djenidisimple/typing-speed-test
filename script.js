import { easy } from "./src/level.js";

let background = document.createElement("div");
let div, body = document.body, span, textUser = [], color = "";
let content = document.querySelector(".content");
let cursor = (textUser.length - 1 < 0) ? 0 : textUser.length - 1;
let restart = document.querySelector(".btn-restart");
let config = document.querySelector(".config");
let time = document.querySelector(".time");
time.innerText = "60";
background.className = "background";
body.appendChild(background);
easy.split("").forEach(value => {
    content.innerHTML += "<span class='text'>"+ value + "</span>";
});

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
        color = (e.key == easy.split("")[cursor]) ? "var(--green-500)" : "var(--red-500)";
        span[cursor].style.color = color;
        if (cursor + 1 == easy.split("").length) {
            config.style.display = "none";
            content.style.display = "none";
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
    cursor = 0;
    span.forEach(value => {value.style.color = "var(--neutral-400)"});
    config.style.display = "block";
    content.style.display = "block";
    span[cursor].classList.add("pointer");
    time.innerText = "60";
});

setInterval(() => {
    time.innerText = (parseInt(time.textContent) > 0) ? parseInt(time.textContent) - 1 : 0;
    if (time.textContent == "0") {
        config.style.display = "none";
        content.style.display = "none";
    }
}, 1000);
