document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#startButton')
    const width = 10
    let nextRandom = 0
    let timerID
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    //The Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    //Select Tetromino and its rotation randomly 
    let random = Math.floor(Math.random()*theTetrominos.length)
    let current = theTetrominos[random][currentRotation]

    //Draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    //Undraw the teromino
    function unDraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    //move down tetromino every X ms
    //timerID = setInterval(moveDown, 500);

    //assign functions to keyCodes
    function control(e) {
        if(e.keyCode === 37){
            moveLeft()
        } else if(e.keyCode === 38){
            rotate()
        } else if (e.keyCode === 39){
            moveRight()
        } else if (e.keyCode === 40){
            moveDown()
        }
    }

    document.addEventListener('keyup', control)

    //move down function
    function moveDown() {
        unDraw()
        currentPosition += width
        draw()
        freeze()
    }

    //freeze function
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            
            //start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominos.length)
            current=theTetrominos[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    //movement left, unless at wall
    function moveLeft(){
        unDraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge){
            currentPosition -= 1
        }

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition += 1
        }
        draw()
    }

    //move right, unless at wall
    function moveRight() {
        unDraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

        if(!isAtRightEdge){
            currentPosition += 1
        }

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -= 1
        }
        draw()
    }

    ///FIX ROTATION OF TETROMINOS A THE EDGE 
    function isAtRight() {
        return current.some(index=> (currentPosition + index + 1) % width === 0)  
    }
  
    function isAtLeft() {
        return current.some(index=> (currentPosition + index) % width === 0)
    }
    
    function checkRotatedPosition(P){
        P = P || currentPosition        //get current position.  Then, check if the piece is near the left side.
        if ((P+1) % width < 4) {        //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
        if (isAtRight()){               //use actual position to check if it's flipped over to right side
            currentPosition += 1        //if so, add one to wrap it back around
            checkRotatedPosition(P)     //check again.  Pass position from start, since long block might need to move more.
            }
        }
        else if (P % width > 5) {
        if (isAtLeft()){
            currentPosition -= 1
        checkRotatedPosition(P)
        }
        }
    }


    //rotate tetromino
    function rotate(){
        unDraw()
        currentRotation++
        
        //if rotation reaches end of array of possible rotations
        if(currentRotation === current.length){
            currentRotation = 0
        }

        current = theTetrominos[random][currentRotation]
        checkRotatedPosition()
        draw()
    }

    //show next tetromino in miniGrid 
    const displaySquares = document.querySelectorAll('.miniGrid div')
    const displayWidth = 4
    const dispalyIndex = 0

    //tetromino without rotation to display
    const upNextTetromino = [
        [1, width+1, width*2+1, 2],     //lTetromino
        [0, width, width+1, width*2+1], //zTetromino
        [1,width,width+1,width+2],      //tTetromino
        [0,1,width,width+1],            //oTetromino
        [1,width+1,width*2+1,width*3+1] //iTetromino
    ]

    //dispaly next tetromino
    function displayShape(){
        //remove tetromino from miniGrid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })

        upNextTetromino[nextRandom].forEach(index => {
            displaySquares[dispalyIndex + index].classList.add('tetromino')
            displaySquares[dispalyIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //add functionality to the button
    startBtn.addEventListener('click', () => {
        if(timerID){
            clearInterval(timerID)
            timerID = null
        } else{
            draw()
            timerID = setInterval(moveDown, 750)
            nextRandom = Math.floor(Math.random()*theTetrominos.length)
            displayShape()
        }
    })
    

    //add score
    function addScore() {
        for (let i = 0; i < 199; i +=width) {
          const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
    
          if(row.every(index => squares[index].classList.contains('taken'))) {
            score +=10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
              squares[index].classList.remove('taken')
              squares[index].classList.remove('tetromino')
              squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
          }
        }
      }

    //game over
    function gameOver(){
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerID)
        }
    }
})