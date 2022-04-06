import { getGamesArray, getGameObj, updatePlayers, updateGameInfo, updateMovesTable, toggleBoardFlip, toggleEval, updateCurrMove, getMovesList, getEvalList } from './helpers.js'
import { drawBar } from './drawBar.js'


// chess board configurations
let config = {
   position: 'start',
   draggable: true,
   sparePieces: false,
}

// setting up chess board
let board = Chessboard('chess-board', config)
const chess = new Chess()

// main scripting function
async function main() {

   // getting the gameID from the url params
   const urlParams = new URLSearchParams(window.location.search)
   const gameId = urlParams.get('gameID')

   // fetching player data file
   const gameFilePath = 'json/games/' + gameId + '.json'
   const gameJSON = fetch(gameFilePath)
      .then((res) => res.json())
      .then((res) => { return res })

   async function loadPage() {
      const game = await gameJSON
      let gameObj = getGameObj(game)

      updatePlayers(gameObj)
      updateGameInfo(gameObj)
      updateMovesTable(gameObj)
      
      // drawing the eval graph, hiding until eval toggled on
      drawBar(gameObj, "eval-graph-panel")
      $('#eval-graph-panel').hide()

      // creating our list of positions for managing game state
      let gameMoves = getMovesList(game)

      let fenArray = [chess.fen()]
      for (let m = 0; m < gameMoves.length; m++) {
         chess.move(gameMoves[m])
         let currFen = chess.fen()
         fenArray.push(currFen)
      }

      // logic for updating current move
      let currMove = 0;

      // adding functionality to flip board button
      $("#flip-board-checkbox").click(() => {
         toggleBoardFlip(board)
      })

      // adding functionality to eval toggler
      $("#eval-checkbox").click((e) => {
         toggleEval(e)
      })

      // for handling arrow key presses
      $(document).on('keydown', (e) => {
         // right arrow key, or left arrow key
         if (e.which == 39) {
            if (currMove < gameMoves.length) {
               currMove++
               updateCurrMove(board, fenArray, currMove)
            }
         } else if (e.which == 37) {
            if (currMove > 0) {
               currMove--
               updateCurrMove(board, fenArray, currMove)
            }
         }
      })

      // previous move button
      $("#prev-button").click(() => {
         if (currMove > 0) {
            currMove--
            updateCurrMove(board, fenArray, currMove)
         }
      }) 

      // next move button
      $("#next-button").click(() => {
         if (currMove < gameMoves.length) {
            currMove++
            updateCurrMove(board, fenArray, currMove)
         }
      }) 

      // return to start button
      $("#start-button").click(() => {
         currMove = 0
         updateCurrMove(board, fenArray, currMove)
      })

      // advance to end button
      $("#end-button").click(() => {
         currMove = gameMoves.length
         updateCurrMove(board, fenArray, currMove)
      })

      // looking for mouse clicks on moves-grid
      $('.move-eval-pair').on('click', (e) => {
         let clickTarget = e.target.id
         let moveId = clickTarget.replace('move-', '')
         currMove = moveId
         updateCurrMove(board, fenArray, currMove)
      })

   }

   loadPage()

}

main()