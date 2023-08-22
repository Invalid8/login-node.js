//End of Important values

const fruits = [
    {
        id: 1,
        key: "apple",
        value: "🍎",
        color: "#ff0000d8"
    },
    {
        id: 2,
        key: "banana",
        value: "🍌",
        color: "#b8b815"
    },
    {
        id: 3,
        key: "orange",
        value: "🍊",
        color: "#ff4500d8"
    },
    {
        id: 4,
        key: "watermelon",
        value: "🍉",
        color: "#32cd32d8"
    },
    {
        id: 5,
        key: "pear",
        value: "🍐",
        color: "#008000d8"
    }
]

let playerFruits = [];

const gameWins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
]

const game_Home = document.querySelector(".gameHome");
const exitBtn = document.querySelector(".exit-btn");
const scoresBtn = document.querySelector(".scores-btn");

let gameTypeChoice;
let backDrop, theWinner;

let playerNames = [];
let confirmDone = [];
let highScoreList = [];
let point1 = 0;
let point2 = 0;

let score1 = 0;
let score2 = 0;

//End of Important values

window.addEventListener(('load'), () => {
    animate();
});

//Game Home Page
function animate() {
    gotToScores();

    playerFruits = [];
    playerNames = [];
    confirmDone = []
    score1 = 0;
    score2 = 0;

    exitBtn.style.display = "none";
    game_Home.innerHTML = gamePreloader();

    const spanContainer = game_Home.querySelector(".gameAnimation");
    const aniSpans = spanContainer.querySelectorAll("span");

    let changeClr = setInterval(change, 700);
    let i = 0;
    function change() {
        if (i > 2) {
            i = 0;
        }
        aniSpans.forEach((aniSpan) => {
            aniSpan.style.scale = "1";
            aniSpan.style.backgroundColor = "#f1f5f8";
            aniSpans[i].style.scale = "1.5";
            switch (aniSpans[i].textContent) {
                case "🍊":
                    aniSpans[i].style.backgroundColor = "orange";
                    break;
                case "🍌":
                    aniSpans[i].style.backgroundColor = "yellow";
                    break;
                case "🍐":
                    aniSpans[i].style.backgroundColor = "green";
                    break;
                default:
                    break;
            }
        })
        i++
    }

    begin(changeClr)
}
function begin(closeClr) {
    const startBtn = game_Home.querySelector(".startGame");

    startBtn.addEventListener('click', () => {
        const skillLoad = game_Home.querySelector(".in-skill");
        backdrop();

        let progress = setInterval(loading, 50);

        let j = 0;
        function loading() {
            skillLoad.style.width = `${j}%`
            if (j > 100) {
                skillLoad.style.width = "100%";
                j = 0
                clearInterval(progress)
                clearInterval(closeClr);
                game_Home.innerHTML = gameType();
                backDrop.remove();
                chooseGameType();
            }
            j += 5;
        }
    });
}
function gamePreloader() {
    return `
        <div class="game-preLoader">
            <h1>fruit Tac - Toe</h1>
            <div class="gameAnimation">
                <span>🍊</span>
                <span>🍌</span>
                <span>🍐</span>
            </div>
            <button type="submit" class="startGame">play</button>
            <span class="skills"><span class="in-skill"></span></span>
        </div>
    `
}
//End of Game Home Page

//

//Select Game Type
function gameType() {
    return `
        <div class="game-type">
        <h1>Select game type</h1>
            <div class="type_box">
                <div class="type" id="Player">
                    <h2>Player</h2>
                    <h3>vs<h3>
                    <h2>Player</h2>
                </div>
                <div class="type" id="Computer">
                    <h2>Computer</h2>
                    <h3>vs<h3>
                    <h2>Player</h2>
                </div>
            </div>
            <div class="btnContainer">
                <button class="top-btn back-btn">Back</button>
            <div>
            <span class="skills"><span class="in-skill"></span></span>
        </div>
    `
}
function chooseGameType() {
    const types = game_Home.querySelectorAll(".type");
    const goHome = game_Home.querySelector(".back-btn");

    goHome.addEventListener('click', () => {
        animate()
    })

    types.forEach((type) => {
        type.addEventListener('click', () => {
            backdrop();
            const skillLoad = game_Home.querySelector(".in-skill");

            let progress = setInterval(loading, 50);

            let j = 0;
            function loading() {
                skillLoad.style.width = `${j}%`
                if (j > 100) {
                    skillLoad.style.width = "100%";
                    j = 0

                    gameTypeChoice = type.id;
                    game_Home.innerHTML = inputName();
                    switch (gameTypeChoice) {
                        case "Player":
                            enterPlayerName(1);
                            enterPlayerName(2);
                            click_store("two");
                            break;
                        case "Computer":
                            enterPlayerName(1);
                            click_store("one");
                            break;

                        default:
                            break;
                    }
                    backDrop.remove();
                    clearInterval(progress);
                }
                j += 5;
            }
        });
    });
}
//End of Select Game Type

//

//Add Players Name
function enterPlayerName(num) {
    let sFormat = game_Home.querySelector('.sFormat');
    let creativeBox;

    if (creativeBox) {
        return;
    }

    creativeBox = createNewCourse();

    sFormat.innerHTML += creativeBox;

    function createNewCourse() {
        return (`
            <div class="inputCourse">
                <label for="courseName">Player${num} Name</label><br/>
                <input type="text" id="name" placeholder=Player${num} value=Player${num} autocomplete="off" autofocus ><br/>
                <div class="error" style="color:red;"></div>
            </div>
            <div class="charBox">
                <h2>Choose your fruity</h2>
                <div class="iBox" id=player${num}Char>
                </div>
            </div>
        `)
    }
}
function inputName() {
    return `
        <div class="store">
        <h1>Enter Name</h1>
            <div class="error" style="background-color:white; color:red;"></div>
            <div class= "sFormat">
            </div>
            <div class="buttonBox">
                <button class="enterName">Start Game</button>
            </div>
        </div>
        <div class="btnContainer">
            <button class="top-btn back-btn">Back</button>
        <div>
    `
}
function click_store(type) {
    const goHome = game_Home.querySelector(".back-btn");
    goHome.addEventListener('click', () => {
        animate();
    })

    let chars = game_Home.querySelectorAll('.iBox');
    let eachFruits = fruits.map((value) => {
        return `<span class="${value.key}" data-color="${value.color}">${value.value}</span>`
    })
    chars.forEach((char) => {
        char.innerHTML = eachFruits.join('');
    })

    let store = game_Home.querySelector('.store');
    let error = store.querySelector('.error');
    let nameBox = store.querySelector('#name');
    nameBox.addEventListener('click', () => {
        error.innerHTML = '';
    })
    let saveName = store.querySelector(".enterName");
    saveName.addEventListener('click', create_btn);

    let Player1chars = game_Home.querySelector('#player1Char');
    let Player2chars;

    let fruit1, fruit2;

    let chars1 = Player1chars.querySelectorAll('span');

    chars1.forEach((char) => {
        char.addEventListener('click', (chart) => {
            error.innerHTML = ""
            chars1.forEach((chars) => {
                chars.style.backgroundColor = "#055897"
                chars.style.scale = "1";
            })
            if (!playerFruits.includes(chart.currentTarget.innerText)) {
                playerFruits[0] = fruit1
                chart.currentTarget.style.backgroundColor = "#ff0000be"
                chart.currentTarget.style.scale = "1.2";
                fruit1 = {
                    id: 1,
                    value: chart.currentTarget.innerText,
                    key: chart.currentTarget.className,
                    color: chart.currentTarget.dataset.color
                };
            }
        })
    })

    if (game_Home.querySelector('#player2Char') !== null) {
        Player2chars = game_Home.querySelector('#player2Char');
        let chars2 = Player2chars.querySelectorAll('span');

        chars2.forEach((char) => {
            char.addEventListener('click', (chart) => {
                error.innerHTML = ""
                chars2.forEach((chars) => {
                    chars.style.backgroundColor = "#055897"
                    chars.style.scale = "1";
                })
                if (chart.currentTarget.innerText !== fruit1.value) {
                    playerFruits[1] = fruit2
                    chart.currentTarget.style.backgroundColor = "#ff0000be"
                    chart.currentTarget.style.scale = "1.2";
                    fruit2 = {
                        id: 2,
                        value: chart.currentTarget.innerText,
                        key: chart.currentTarget.className,
                        color: chart.currentTarget.dataset.color
                    };
                }
            })
        })
    }

    function create_btn() {
        if (fruit2 === undefined) {
            fruit2 = {
                id: 1,
                value: "🥥",
                key: "coconut",
                color: "#8d5408d8"
            }
        }
        console.log(playerFruits)
        playerFruits = [fruit1, fruit2];
        if (fruit1 !== undefined && fruit2 !== undefined) {
            let theCourses = store.querySelectorAll('#name');
            let error = store.querySelector('.error');
            theCourses.forEach((theCourse) => {
                switch (type) {
                    case "two":
                        if (theCourse.value !== '' && !playerNames.includes(theCourse.value) && theCourse.value.length < 9) {
                            playerNames.push((theCourse.value));
                        } else if (theCourse.value.length > 8) {
                            error.innerHTML = `<p style="padding:10px;">Name is too long(use names less than eight(8))</p>`
                        } else if (theCourse.value !== '') {
                            error.innerHTML = `<p style="padding:10px;">No Input!</p>`
                        }
                        if (playerNames.length > 1) {
                            game_Home.innerHTML = pvpAndComputer(playerNames[0], playerNames[1]);
                            playGame("pvp");
                        }

                        break;

                    case "one":
                        playerNames.push(theCourse.value);
                        playerNames.push("Computer");
                        game_Home.innerHTML = pvpAndComputer(playerNames[0], playerNames[1]);
                        playGame("computer");

                        break;

                    default:
                        break;
                }
                return playerNames;
            })
        } else {
            error.innerHTML = `<p style="padding:10px;">Select your fruit!</p>`
        }
    }
}
//End Add Players Name

//

//Start Game
function pvpAndComputer(p1, p2) {
    exitBtn.style.display = "block";
    backHome();
    exitBtn.style.backgroundColor = "#055897"
    exitBtn.style.color = "white"

    return `
    <section class="gameBox">
        <div class="title">
            <h1>Fruit Tac-Toe</h1>
            <span></span>
        </div>
        <div class="container">
            <div class="scoreBoard">
                <!-- <span>Score:</span> -->
                <div>
                    <span class=resultA>
                    <span class="k1">${p1} ${playerFruits[0].value}</span>
                        <span class="result1">0</span>
                    </span>
                    <span class=resultB>
                        <span class="k2">${p2} ${playerFruits[1].value}</span>
                        <span class="result2">0</span>
                    </span>
                </div>
            </div>
            <div class="boxContainer">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </section>
    `
}
function clearSpan(boxes) {
    boxes.forEach((box) => {
        box.innerText = "";
        box.className = "";
        box.id = "";
        box.dataset.fruits = "";
        box.style.backgroundColor = "#055897"
    })
}
function playGame(type) {
    fruitsColor = []
    const endResult1 = game_Home.querySelector(".result1");
    const endResult2 = game_Home.querySelector(".result2");

    endResult1.style.backgroundColor = playerFruits[0].color;
    endResult2.style.backgroundColor = playerFruits[1].color;

    const boxContainer = game_Home.querySelector(".boxContainer");
    const spanBoxes = boxContainer.querySelectorAll("span");

    let takenSpace = [];
    let computerChoice = [0, 1, 2, 3, 4, 5, 6, 7, 8,];

    let space = 1;
    spanBoxes.forEach((spanBox, item) => {
        switch (type) {
            case "pvp":
                spanBox.addEventListener('click', () => {
                    if (space > 2) {
                        space = 1;
                    }
                    if (spanBox.id === "" && spanBox.innerText === "") {
                        spanBox.className = "player" + space;
                        spanBox.id = item;
                        spanBox.innerText = playerFruits[space - 1].value;
                        spanBox.dataset.fruits = playerFruits[space - 1].key
                        confirmDone.push(item);
                        done();
                        space++;
                    }
                });
                break;

            case "computer":
                spanBox.addEventListener('click', () => {
                    if (spanBox.id === "" && spanBox.className === "") {
                        space = 1
                        while (space < 3) {
                            if (space > 2) {
                                space = 1;
                            }
                            switch (space) {
                                case 1:
                                    spanBox.className = "player";
                                    takenSpace.push(item);
                                    computerChoice = computerChoice.filter((value) => {
                                        return value !== item;
                                    })
                                    spanBox.innerText = playerFruits[0].value;
                                    spanBox.dataset.fruits = playerFruits[0].key
                                    confirmDone.push(item);
                                    game_Home.classList.add("played");
                                    done();
                                    break;

                                case 2:
                                    let progress = setInterval(loading, 100);

                                    let j = 0;
                                    function loading() {
                                        if (j > 10) {
                                            j = 0

                                            let randChoice = Math.floor(Math.random() * (computerChoice.length));
                                            if (!checkWin(spanBoxes)) {
                                                if (!checkWin(spanBoxes)) {
                                                    if (takenSpace.includes(randChoice)) {
                                                        randChoice = Math.floor(Math.random() * (computerChoice.length));
                                                    }
                                                    const theFinal = computerChoice[randChoice];
                                                    confirmDone.push(theFinal);
                                                    if (spanBoxes[theFinal].innerText === "" && spanBoxes[theFinal].className === "") {
                                                        spanBoxes[theFinal].className = "computer";
                                                        spanBoxes[theFinal].innerText = playerFruits[1].value;
                                                        spanBoxes[theFinal].dataset.fruits = playerFruits[1].key

                                                        computerChoice = computerChoice.filter((value) => {
                                                            return value !== theFinal;
                                                        })
                                                        done();
                                                        game_Home.classList.remove("played");
                                                        ///
                                                    }
                                                }
                                            }
                                            clearInterval(progress)
                                        }
                                        j += 10;
                                    }
                                    break;
                            }
                            space++;
                        }
                    }
                });
                function done() {
                    if (checkWin(spanBoxes)) {
                        if (theWinner === playerNames[0]) {
                            score1 += 5;
                            endResult1.textContent = score1;
                            endResult2.textContent = score2;
                        } else if (theWinner === playerNames[1]) {
                            score2 += 5;
                            endResult1.textContent = score1;
                            endResult2.textContent = score2;
                        }
                        youWin(`${theWinner} Wins`, spanBoxes);
                        confirmDone = [];
                        takenSpace = [];
                        computerChoice = [0, 1, 2, 3, 4, 5, 6, 7, 8,];
                        return true;
                    }
                    if (confirmDone.length > 8) {
                        youWin("No Winner", spanBoxes);
                        confirmDone = [];
                        takenSpace = [];
                        computerChoice = [0, 1, 2, 3, 4, 5, 6, 7, 8,];
                    }
                }
                break;

            default:
                break;
        }

        // function checkResults() {
        //     if (checkWin(spanBoxes)) {
        //         if (theWinner = playerNames[0]) {
        //             score1 += 5;
        //             endResult1.textContent = score1;
        //             endResult2.textContent = score2;
        //         } else {
        //             score2 += 5;
        //             endResult1.textContent = score1;
        //             endResult2.textContent = score2;
        //         }
        //         youWin(`${theWinner} Wins`, spanBoxes);
        //         confirmDone = [];
        //         takenSpace = [];
        //         computerChoice = [0, 1, 2, 3, 4, 5, 6, 7, 8,];
        //     }
        //     if (confirmDone.length > 8) {
        //         youWin("No Winner", spanBoxes);
        //         confirmDone = [];
        //         takenSpace = [];
        //         computerChoice = [0, 1, 2, 3, 4, 5, 6, 7, 8,];
        //     }
        // }
    });

}

function checkWin(box) {

    for (const item of gameWins) {
        const each = item.map((value) => {
            return value
        })
        if (box[each[0]].textContent !== "") {
            if ((box[each[0]].textContent === box[each[1]].textContent) && (box[each[0]].textContent === box[each[2]].textContent)) {
                if (box[each[0]].textContent === playerFruits[0].value) {
                    box[each[0]].style.backgroundColor = playerFruits[0].color;
                    box[each[1]].style.backgroundColor = playerFruits[0].color;
                    box[each[2]].style.backgroundColor = playerFruits[0].color;
                    theWinner = playerNames[0];
                } else if (box[each[0]].textContent === playerFruits[1].value) {
                    box[each[0]].style.backgroundColor = playerFruits[1].color;
                    box[each[1]].style.backgroundColor = playerFruits[1].color;
                    box[each[2]].style.backgroundColor = playerFruits[1].color;
                    theWinner = playerNames[1];
                }
                return true;
            }
        }
    }
    return false;
}
let winner;
function youWin(gameResult, boxes) {
    if (winner) {
        return;
    }

    winner = document.createElement('div');
    winner.className = "Box";

    winner.innerHTML = createModal();

    game_Home.append(winner);
    backdrop();

    winner.addEventListener('click', function () {
        clearSpan(boxes);
        winner.remove();
        winner = null;
        backDrop.remove();
    });

    backDrop.addEventListener('click', function () {
        clearSpan(boxes);
        winner.remove();
        winner = null;
        backDrop.remove();
    });

    function createModal() {
        return (`
            <div class="gameResult">
                <h1>${gameResult}!</h1>
            </div>
        `)
    }
}
//End of start game

//

//Sub Functions
function backHome() {
    let exitGame;
    exitBtn.addEventListener('click', () => {

        if (exitGame) {
            return;
        }

        exitGame = document.createElement('div');
        exitGame.className = "closeBox";

        exitGame.innerHTML = createModal();
        game_Home.append(exitGame);

        let cancelButton = exitGame.querySelector('.cancelBtn')
        cancelButton.addEventListener('click', cancelFunc);

        let exitButton = exitGame.querySelector('.exitBtn')
        exitButton.addEventListener('click', exit);
    });

    function closeSync() {
        exitGame.remove()
        exitGame = null
    }

    function cancelFunc() {
        closeSync();
    }

    function exit() {
        addHighScore()
        animate()
        closeSync();
    }

    function createModal() {
        return (`
            <div class = "exitBox">
                <p>Are you sure you want to exit game ?</p>
                <div class="buttonBox">
                    <button class="cancelBtn">No</button>
                    <button class="exitBtn">Yes</button>
                </div>
            </div>
        `)
    }
}
function gotToScores() {
    scoresBtn.addEventListener('click', () => {
        if (scoresBtn.textContent === "Scores") {
            scoresBtn.classList.add("active");
            showHighScores();
        } else {
            scoresBtn.classList.remove("active");
        }
    })
}
let chances
function showHighScores() {
    if (chances) {
        return;
    }

    chances = document.createElement('div');
    chances.className = "highScore"

    chances.innerHTML = scoreBox();
    game_Home.append(chances);

    backdrop();

    const closeHigh = chances.querySelector(".close-high");
    closeHigh.addEventListener('click', closeBox);
    backDrop.addEventListener('click', closeBox);

    const putList = chances.querySelector(".list");

    const addScores = highScoreList.map((value) => {
        return `<li><span>${value[0].key1} vs ${value[1].key2}</span>--<span>Score: ${value[0].value1} - ${value[1].value2}</span></li>`
    })

    putList.innerHTML = addScores.join('');

    function closeBox() {
        chances.remove();
        chances = null;

        backDrop.remove();
    }

    function scoreBox() {
        return `
        <button class="top-btn close-high">Close</button>
        <h1>Score Board</h1>
        <ul class="list">
        </ul>

        `
    }
}

function addHighScore() {
    highScoreList.push(
        [
            {
                key1: playerNames[0],
                value1: score1,
                id: 1
            },

            {
                key2: playerNames[1],
                value2: score2,
                id: 2
            }
        ]
    );
    if (highScoreList.length > 5) {
        highScoreList.shift();
    }
    console.log(highScoreList);
}
function backdrop() {
    backDrop = document.createElement('div');
    backDrop.className = "backdrop";
    document.body.append(backDrop);
}
//End of Sub Functions

//local storage

//!!!!!
