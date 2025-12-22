import { easy } from "./src/level.js";

let background = document.createElement("div");
let div, body = document.body, span, textUser = [], color = "";
let content = document.querySelector(".content");
let cursor = (textUser.length - 1 < 0) ? 0 : textUser.length - 1;
background.className = "background";
body.appendChild(background);
easy.split("").forEach(value => {
    content.innerHTML += "<span class='text'>"+ value + "</span>";
});

span = document.querySelectorAll("span.text");


for (let i = 0; i < 12; i++) {
    div = document.createElement("div");
    div.className = "items";
    background.appendChild(div);
}

document.addEventListener("keydown", function(e) {
    let regex = /[a-zA-Z0-9@.,/?&!#$%^&*()=-`~'";<>\\|\[\]{}\e]/;    
    if (e.key.length === 1 && regex.test(e.key)) {
        textUser.push(e.key);
        color = (e.key == easy.split("")[cursor]) ? "var(--green-500)" : "var(--red-500)";
        span[cursor].style.color = color;
        cursor++;
    } else if (e.key == "Backspace" || e.key == "Delete" && textUser.length > 0) {
        span[cursor - 1].style.color = "var(--neutral-400)";
        textUser.pop()
        cursor = (cursor > 0) ? cursor - 1 : 0;
    }
});