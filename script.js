let background = document.createElement("div");
let div, body = document.body;
background.className = "background";
body.appendChild(background);

for (let i = 0; i < 12; i++) {
    div = document.createElement("div");
    div.className = "items";
    background.appendChild(div);
}