async function getText() {
    const response = await fetch("./data.json");   
    if (!response.ok) {
        return null;
    }
    const data = await response.json();
    return data;
}

export const valueText = await getText();