"use strict" 

import '../css/styles.css'

import { allShapes, gridWidth } from '../utils/shapes.js'
import { colors } from '../utils/colors.js'
import { draw, undraw } from './draw.js'


const shapeFreezeAudio = new Audio("./audio/audios_tetraminoFreeze.wav")
const completedLineAudio = new Audio("./audio/audios_completedLine.wav")
const gameOverAudio = new Audio("./audio/audios_gameOver.wav")

let currentColor = Math.floor(Math.random() * colors.length)
let nextColor = colors[currentColor]

let currentPosition = 3;
let currentRotation = 0;
let randomShape = Math.floor(Math.random() * allShapes.length);
let currentShape = allShapes[randomShape][currentRotation];
let $gridSquares = Array.from(document.querySelectorAll(".grid div"));

draw({currentShape, gridSquares: $gridSquares, currentPosition, currentColor: colors[currentColor]});

const $restartButton = document.getElementById("container__button-restart")
$restartButton.addEventListener("click", ()=> {
    window.location.reload()
})

let timeMoveDown = 600
let timerId = null
const $startStopButton = document.getElementById("container__button-start")
$startStopButton.addEventListener("click", () => {
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    } else {
        timerId = setInterval(moveDown, timeMoveDown);
    }
});

function moveDown() {
    freeze();
    undraw({currentShape, gridSquares: $gridSquares, currentPosition, currentColor: colors[currentColor]});
    currentPosition += 10;
    draw({currentShape, gridSquares: $gridSquares, currentPosition, currentColor: colors[currentColor]});
}

function freeze() {
   if(currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition + gridWidth].classList.contains("filled")
    )){
        currentShape.forEach(squareIndex => 
            $gridSquares[squareIndex + currentPosition].classList.add("filled")
        )
       
        currentPosition = 3;
        currentRotation = 0;
        randomShape = nextRandomShape;
        currentShape = allShapes[randomShape][currentRotation];
        currentColor = nextColor
        draw({currentShape, gridSquares: $gridSquares, currentPosition, currentColor: colors[currentColor]});
        checkIfRowIsFilled()
        updateScore(13)
        // shapeFreezeAudio.play()
        displayNextShape()
        gameOver();
    }
}

function moveLeft() {
    let isEdgeLimit = currentShape.some(squereIndex => (squereIndex + currentPosition) % gridWidth === 0)
    if (isEdgeLimit) return;

    let isFilled = currentShape.some(squareIndex => $gridSquares[squareIndex + currentPosition - 1].classList.contains('filled'))
    if (isFilled) {
        previousRotation()
    }

    undraw({currentShape, gridSquares: $gridSquares, currentPosition, currentColor: colors[currentColor]});
    currentPosition--;
    draw({currentShape, gridSquares: $gridSquares, currentPosition, currentColor: colors[currentColor]});
}

function moveRight() {
    let isEdgeLimit = currentShape.some(squereIndex => (squereIndex + currentPosition) % gridWidth === (gridWidth-1))
    if (isEdgeLimit) return;

    let isFilled = currentShape.some(squareIndex => $gridSquares[squareIndex + currentPosition + 1].classList.contains('filled'))
    if (isFilled) return;

    undraw({currentShape, gridSquares: $gridSquares, currentPosition, currentColor: colors[currentColor]});
    currentPosition++;
    draw({currentShape, gridSquares: $gridSquares, currentPosition, currentColor: colors[currentColor]});
}

function previousRotation() {
    if (currentRotation === 0){
        currentRotation = currentShape.length - 1;
    } else {
        currentRotation--
    }
    currentShape = allShapes[randomShape][currentRotation];
}

function rotate() {
    undraw({currentShape, gridSquares: $gridSquares, currentPosition, currentColor: colors[currentColor]});

    if(currentRotation === currentShape.length - 1){
        currentRotation = 0;
    } else {
        currentRotation++;
    }

    currentShape = allShapes[randomShape][currentRotation];

    const isLeftEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === 0)
    const isRigthEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === gridWidth - 1)
    const isFilled = currentShape.some(squareIndex => 
        $gridSquares[squareIndex + currentPosition].classList.contains('filled')
    )

    if ((isLeftEdgeLimit && isRigthEdgeLimit) || isFilled) {
        previousRotation();
    }

    draw({currentShape, gridSquares: $gridSquares, currentPosition, currentColor: colors[currentColor]});
}

let $grid = document.querySelector(".grid")
function checkIfRowIsFilled() {
    for (var row = 0; row < $gridSquares.length; row += gridWidth ){
        let currentRow = []
        for (var square = row; square < row + gridWidth; square++){
            currentRow.push(square)
        }

        const isRowPainted = currentRow.every(
            square => $gridSquares[square].classList.contains("shapePainted")
        )
        
        if (isRowPainted) {
            const squaresRemoved = $gridSquares.splice(row,gridWidth)
            squaresRemoved.forEach((square)=> square.removeAttribute("class"))
            $gridSquares = squaresRemoved.concat($gridSquares)
            $gridSquares.forEach(square => $grid.appendChild(square))
            updateScore(97)
            // completedLineAudio.play()
        }
    }
}

const $mineGridSquares = document.querySelectorAll(".mini__grid div")
const miniGridWidth = 6
const nextPosition = 2
const possibleNextShapes = [
    [1, 2, miniGridWidth + 1, miniGridWidth*2+1],
    [miniGridWidth+1, miniGridWidth+2, miniGridWidth*2, miniGridWidth*2+1],
    [1, miniGridWidth, miniGridWidth+1, miniGridWidth+2],
    [0, 1, miniGridWidth, miniGridWidth+1],
    [1, miniGridWidth+1, miniGridWidth*2+1, miniGridWidth*3+1]
]
let nextRandomShape = Math.floor(Math.random() * possibleNextShapes.length)

function displayNextShape() {
    $mineGridSquares.forEach(square => square.classList.remove("shapePainted",`${colors[nextColor]}`))
    nextRandomShape = Math.floor(Math.random() * possibleNextShapes.length)
    nextColor = Math.floor(Math.random() * colors.length)
    const nextShape = possibleNextShapes[nextRandomShape]
    nextShape.forEach(squareindex => 
        $mineGridSquares[squareindex + nextPosition + miniGridWidth].classList.add("shapePainted", `${colors[nextColor]}`)
    )
}
displayNextShape()

const $score = document.querySelector(".score")
let score = 0
function updateScore(updateValue) {
    score += updateValue
    $score.textContent = score

    clearInterval(timerId)
    if (score <= 450) {
        timeMoveDown = 500
    } else if (450 < score && score <= 1000) {
        timeMoveDown = 400
    } else if (1000 < score && score <= 1700) {
        timeMoveDown = 300
    } else if (1700 < score && score <= 2700) {
        timeMoveDown = 200
    } else if (2700 < score && score <= 3850) {
        timeMoveDown = 150
    } else {
        timeMoveDown = 110
    }
    timerId = setInterval(moveDown, timeMoveDown)
}

function gameOver() {
    let isGameOver = currentShape.some(squareIndex => $gridSquares[squareIndex + currentPosition].classList.contains("filled"))
    if (isGameOver) {
        updateScore(-13)
        clearInterval(timerId)
        timerId = null
        $startStopButton.disabled = true
        // gameOverAudio.play()
        $score.innerHTML+= "<br/>" + "GAME OVER"
    }
}

document.addEventListener("keydown", controlKeyBoard);

function controlKeyBoard(event) {
    if (timerId) {
        if(event.key === "ArrowLeft") {
            moveLeft();
        }else if (event.key === "ArrowRight") {
            moveRight();
        }else if (event.key === "ArrowDown") {
            moveDown();
        }else if (event.key === "ArrowUp") {
            rotate();
        }
    }
}

const isMobile = window.matchMedia('(max-width: 990px)').matches
if (isMobile) {
    const $mobile = document.querySelectorAll(".mobile-buttons-container button")
    $mobile.forEach(button => button.addEventListener("click", () => {
        if (timerId){
            if (button.classList[0] === "left-button") {
                moveLeft();
            } else if (button.classList[0] === "right-button") {
                moveRight();
            } else if (button.classList[0] === "down-button") {
                moveDown();
            } else if (button.classList[0] === "rotate-button") {
                rotate();
            }
        }
    }))
}