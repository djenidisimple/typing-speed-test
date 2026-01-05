async function getText() {
    const response = await fetch("./data.json");   
    if (!response.ok) {
        return null;
    }
    const data = await response.json();
    return data;
}

function writeText(text, content) {
    content.innerHTML = "";
    text.split("").forEach(value => {
        content.innerHTML += "<span class='text'>"+ value + "</span>";
    });
}

export { getText, writeText }