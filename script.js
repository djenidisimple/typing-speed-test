import { easy } from "./src/level.js";

let background = document.createElement("div");
let div, body = document.body, span, textUser = [], color = "";
let content = document.querySelector(".content");
let cursor = (textUser.length - 1 < 0) ? 0 : textUser.length - 1;
let restart = document.querySelector(".btn-restart");
let main = document.querySelector("main"), footer = document.querySelector("footer");
let time = document.querySelector(".time");
let resultat = document.querySelector(".resultat");
time.innerText = "60";
background.className = "background";
body.appendChild(background);
easy.split("").forEach(value => {
    content.innerHTML += "<span class='text'>"+ value + "</span>";
});

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
        color = (e.key == easy.split("")[cursor]) ? "var(--green-500)" : "var(--red-500)";
        span[cursor].style.color = color;
        if (cursor + 1 == easy.split("").length) {
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

// setInterval(() => {
//     time.innerText = (parseInt(time.textContent) > 0) ? parseInt(time.textContent) - 1 : 0;
//     if (time.textContent == "0") {
//         main.style.display = "none";
//         footer.classList.remove("border-t");
//         resultat.style.display = "block";
//     }
// }, 1000);
