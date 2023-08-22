const btn = document.getElementById("btn");
const color = document.getElementById("color");

const hex = [0, 1, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];

btn.addEventListener("click", function(){
    let hexColor = "#";
    for (let i = 0; i < 6; i++) {
        hexColor += hex[getRandomNumber()]
    }
    color.textContent = hexColor
    body.style.backgroundColor = `${hexColor}`;
    color.style.color = `${hexColor}`;
    btn.style.color = `${hexColor}`;
})

function getRandomNumber(){
    return Math.floor(Math.random() * hex.length);
}
