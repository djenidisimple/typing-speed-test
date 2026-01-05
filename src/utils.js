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

function countWord(word) {
    let count = 0;
    for (let i = 0; i < word.length; i++) {
        count += (word[i] == " " || word[i] == ".") ? 1 : 0;
    }
    return count;
}

export { getText, writeText, countWord }