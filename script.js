import { easy } from "./src/level.js";

let background = document.createElement("div");
let div, body = document.body, span, textUser = [], color = "";
let content = document.querySelector(".content");
let cursor = (textUser.length - 1 < 0) ? 0 : textUser.length - 1;
let restart = document.querySelector(".btn-restart");
let main = document.querySelector("main"), config = document.querySelector(".config");
background.className = "background";
body.appendChild(background);
easy.split("").forEach(value => {
    content.innerHTML += "<span class='text'>"+ value + "</span>";
});

span = document.querySelectorAll("span.text");

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
            cursor = 0;
            main.style.display = "none";
        } else {
            cursor++;
        }
    } else if (e.key == "Backspace" || e.key == "Delete" && textUser.length > 0) {
        span[cursor - 1].style.color = "var(--neutral-400)";
        textUser.pop()
        cursor = (cursor > 0) ? cursor - 1 : 0;
    }
});


restart.addEventListener("click", function() {
    textUser = [];
    cursor = 0;
    span.forEach(value => {value.style.color = "var(--neutral-400)"});
    main.style.display = "block";
});