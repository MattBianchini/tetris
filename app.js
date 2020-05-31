document.addEventListener('DOMContentLoaded', ()=> {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0

    //The Terominoes
    const lTetromino = [
        [1, width+1, width*2+1,2],
        [0, 1, 2, width+2],
        [1, width+1, width*2+1, width*2,],   
        [0, width, width+1, width+2]
    ]

    const reverseLTetromino = [
        [0, 1, width+1, width*2+1],
        [2, width, width+1, width+2],
        [1, width+1, width*2+1, width*2+2],
        [width, width+1, width+2, width*2],
    ]

    const sTetromino = [
        [1, 2, width, width+1],
        [1, width+1, width+2, width*2+2],
        [1, 2, width, width+1],
        [0, width, width+1, width*2+1],
    ]

    const zTetromino = [
        [0, 1, width+1, width+2],
        [2, width+1, width+2, width*2+1],
        [0, 1, width+1, width+2],
        [1, width, width+1, width*2],
    ]

    const squareTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
    ]

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [0, 1, 2, width+1],
        [1, width, width+1, width*2+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominoes = [lTetromino, reverseLTetromino, sTetromino, zTetromino, tTetromino, squareTetromino, iTetromino]

    let currentPosition = 4;
    let currentRotation = 0;

    //Randomly select a tetromino
    let randomShape = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[randomShape][currentRotation]; 

    //Draw Tertiminos
    function draw () {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')     //Add the style "tetromino" to that Div
        })
    }
    
    //Remove tetrominos
    function undraw () {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino') //Remove the style "tetromino" from that Div
        })
    }
    
    
    //Tetromino Move Timer
    //timerId = setInterval(moveDown, 500)

    //Assign functions to keyCodes
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft()
          } else if (e.keyCode === 38) {
            rotate()
          } else if (e.keyCode === 39) {
            moveRight()
          } else if (e.keyCode === 40) {
            moveDown()
          }
    }
    document.addEventListener('keyup', control)

    //Move tetrominos
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //Stop tetrominos
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            
            //Start a new tetromino
            randomShape = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[randomShape][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    //Move the tetromino left unless at edge
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if (!isAtLeftEdge) currentPosition -=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition +=1
        }
        draw()
    }
    //Move the tetromino right unless at edge
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
        
        if(!isAtRightEdge) currentPosition +=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -=1
        }
        draw()
    }
    function rotate() {
        undraw()
        currentRotation++
        if(currentRotation === current.length) { //If the current rotation is 4, set the rotation to 0
            currentRotation = 0
        }
        current = theTetrominoes[randomShape][currentRotation]
        draw()
    }

    //Display next tetrominos grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0

    //The tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1,2],
        [0, 1, displayWidth+1, displayWidth*2+1],
        [1, 2, displayWidth, displayWidth+1],
        [0, 1, displayWidth+1, displayWidth+2],
        [1, displayWidth, displayWidth+1, displayWidth+2],
        [0, 1, displayWidth, displayWidth+1],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1],
    ]
    
    //display the shape in the mini-grid
    function displayShape() {
        //remove any trace of a tetromino from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
        })
    }

    //Add functionality to the start/stop button
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })

    //Add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
            
            
        }
    }

    //game over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }







})