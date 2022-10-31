let gameboard = (() => {
    let gameboardArray = [" ", " ", " ", " ", " ", " ", " ", " ", " "]
    let update = (number, value) => {
        gameboardArray.splice(number, 1, value); 
        //console.table(gameboardArray)
    }
    let clearBoard = () => gameboardArray = [" ", " ", " ", " ", " ", " ", " ", " ", " "]
    let checkForWinner = () => {
        let x = gameboardArray //makes the conditionals below less long
        console.table(x)
        //check horizontal lines
        if ((x[0] != " " && x[0] === x[1] && x[0] == x[2]) || (x[3] != " " && x[3] === x[4] && x[3] == x[5]) || (x[6] != " " && x[6] === x[7] && x[6] == x[8])) {
            return true
        }
        //checks vertical lines
        if ((x[0] != " " && x[0] === x[3] && x[0] == x[6]) || (x[1] != " " && x[1] === x[4] && x[1] == x[7]) || (x[2] != " " && x[2] === x[5] && x[2] == x[8])) {
            return true
        }
        //checks sideways lines 
        if ((x[0] != " " && x[0] === x[4] && x[0] == x[8]) || (x[2] != " " && x[2] === x[4] && x[2] == x[6])) {
            return true
        }
        return false
    }
    
    let checkForTie = () => {
        for (let i = 0; i < gameboardArray.length; i ++) {
            if (gameboardArray[i] == " ") {
                return false
            }
        }
        return true
    }
    return {update, checkForWinner, checkForTie, clearBoard}
})()

let player = (userName, userMarker) => {
    let name = userName
    let marker = userMarker

    return {name, marker}
}

const displayController = (() => {
    let gameBoardDiv = document.querySelector(".gameboard")
    let gameboardTiles = []

    let createBoard = () => {
        for (let i = 0; i < 9; i++) {         
        gameboardTiles[i] = document.createElement("div")
        gameboardTiles[i].innerText = ""
        gameboardTiles[i].classList.add("tile", `tile${i}`)
        gameboardTiles[i].addEventListener("click", (e) => game.tileClicked(e.target, gameboardTiles.indexOf(e.target)))
        gameBoardDiv.appendChild(gameboardTiles[i])
        }
    }

    let createUserInputUI = () => {
        document.querySelector(".pvpButton").remove()
        document.querySelector(".buttonComputer").remove()

        let uiSection = document.querySelector(".ui") 
        let formContainer = document.createElement("div")
        formContainer.classList.add("formContainer")
        uiSection.appendChild(formContainer)
        let player1Div = document.createElement("div")
        let player2Div = document.createElement("div")
        formContainer.appendChild(player1Div)
        formContainer.appendChild(player2Div)

        let player1Text = document.createElement("h3")
        player1Text.innerText = "Player one: "
        player1Div.appendChild(player1Text)
        let player1Input = document.createElement("input")
        player1Input.placeholder = "Type name here..."
        player1Div.appendChild(player1Input)

        let player2Text = document.createElement("h3")
        player2Text.innerText = "Player two: "
        player2Div.appendChild(player2Text)
        let player2Input = document.createElement("input")
        player2Input.placeholder = "Type name here..."
        player2Div.appendChild(player2Input)

        let startGameButton = document.createElement("button")
        startGameButton.innerText = "start game"
        formContainer.appendChild(startGameButton)

        let player1Name;
        let player2Name;

        startGameButton.addEventListener("click", () => {
            player1Name = player1Input.value
            console.log(player1Input.value)
            player2Name = player2Input.value
            console.log(player2Input.value)
            game.startGame(player1Name, player2Name)
            return
        })
    }

    let createNewUI = (player1Name, player2Name) => {
        let uiSection = document.querySelector(".ui")
        uiSection.classList.add("gameStarted")
        uiSection.innerHTML = ""

        let player1Section = document.createElement("div")
        player1Section.innerText = player1Name
        player1Section.classList.add("player1Section")
        uiSection.appendChild(player1Section)

        let playAgainButton = document.createElement("button") 
        playAgainButton.innerText = "Play Again"
        uiSection.appendChild(playAgainButton)
        playAgainButton.addEventListener("click", () => {
            game.createNewGame()
        })

        let player2Section = document.createElement("div")
        player2Section.innerText = player2Name
        player2Section.classList.add("player2Section")
        uiSection.appendChild(player2Section)

        
    }

    let winner = (winner) => {
        gameBoardDiv.innerHTML = ""
        let winnerTextDisplay = document.createElement('h1')
        winnerTextDisplay.innerText = `${winner} has won! GG`
        gameBoardDiv.appendChild(winnerTextDisplay)
    }
    let tie = () => {
        gameBoardDiv.innerHTML = ""
        let tieTextDisplay = document.createElement('h1')
        tieTextDisplay.innerText = "Its a Tie!"
        gameBoardDiv.appendChild(tieTextDisplay)
    }
    return {winner, tie, createBoard, createUserInputUI, createNewUI}
})()

const game = (() => { 
    let player1;
    let player2;
    let playerTurn = player1


    let createPlayers = (player1Name, player2Name) => {
        player1 = player(player1Name, "x")
        player2 = player(player2Name, "o")
        console.log(player1.sayName)
        console.log(player2.sayName)
        playerTurn = player1
    }
    let startGame = (player1Name, player2Name) => {
        createPlayers(player1Name, player2Name)
        displayController.createBoard()
        displayController.createNewUI(player1Name, player2Name)
    }

    
    console.log(playerTurn)
    let tileClicked = (tile, location) => {
        if (!tile.innerText == " ") {
            return
        }

        
        if (playerTurn == player1) {
            console.log(tile)
            tile.innerText = player1.marker
            document.querySelector(".player1Section").style.textDecoration = "none"
            document.querySelector(".player2Section").style.textDecoration = "underline"
            playerTurn = player2
            gameboard.update(location, player1.marker)
        } else {
            console.log(tile)
            tile.innerText = player2.marker
            document.querySelector(".player1Section").style.textDecoration = "underline"
            document.querySelector(".player2Section").style.textDecoration = "none"
            playerTurn = player1
            gameboard.update(location, player2.marker)
        }
        
        if (gameboard.checkForWinner() == true) {
            //reverse logic because we reasign playerTurn in the block above
            if (playerTurn == player1) {
                displayController.winner(player2.name)
            } else {
                displayController.winner(player1.name)
            }
        } else if (gameboard.checkForTie() == true) {
                displayController.tie()
        }

    }
    let createNewGame = () => {
        gameboard.clearBoard()
        document.querySelector(".gameboard").innerHTML = ""
        displayController.createBoard()
    } 

    document.querySelector(".pvpButton").addEventListener("click", () => {
        displayController.createUserInputUI()
        
    })

    return {tileClicked, startGame, createNewGame}
})()





