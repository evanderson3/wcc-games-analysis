import { drawBar } from "./drawBar.js"
import { drawMiniBar } from "./drawMiniBar.js"

// cleans up the date for presentation
const getCleanDate = (date) => {
   let newDate = new Date(date)
   let splitDate = newDate.toDateString().split(' ')
   let dateString = splitDate[1].concat(' ', splitDate[2], ', ', splitDate[3])

   return dateString
}

// cleans up the evaluation string for presentation
const getCleanEval = (evaluation) => {
   let evalNumber = parseFloat(evaluation)
   let roundEvalNumber = evalNumber.toFixed(1)

   if (roundEvalNumber > 0) {
      roundEvalNumber = '+' + roundEvalNumber
   }
   return roundEvalNumber
}

// makes an array of game objects that are accessible
export const getGamesArray = (gamesJSON) => {
   
   // getting a count of games
   let numGames = Object.keys(gamesJSON).length

   // iterating over json, and adding each game to a list
   let gamesArray = []
   for (let g = 0; g < numGames; g++) {
      gamesArray.unshift(gamesJSON[g])
   }

   return gamesArray
}

// just re-synchronizing our game list
export const getGameObj = (gameJSON) => {

   return gameJSON
}

// just re-synchronizing our event object
export const getEventObj = (eventJSON) => {

   return eventJSON
}


// update game info in UI
export const updateGameInfo = (game, gameId) => {

   let gameDate = new Date(game[0]['date'])
   let gameYear = gameDate.getFullYear()

   let idSplit = gameId.split('_')
   let eventId = idSplit[0] + '_' + idSplit[1] + '_' + idSplit[2]

   $('#event-name-info').html(gameYear + " World Championship Match")
   $('#event-name-info').click(() => {
      location.href = 'event.html?eventID='.concat(eventId)
   })

   $('#round-info').html('Round ' + game[0]['round'])
   $('#date-info').html(getCleanDate(game[0]['date']))
   $('#white-name-info').html(game[0]['white'])
   $('#black-name-info').html(game[0]['black'])
}

// creates a list of moves from the json object
export const getMovesList = (game) => {
   let movesList = []

   for (let val = 0; val < game.length; val++) {
      movesList.push(game[val]['move'])
   }

   return movesList
}

// creates a list of moves from the json object
export const getEvalList = (game) => {
   let evalList = []

   for (let val = 0; val < game.length; val++) {
      evalList.push(game[val]['evaluation'])
   }

   return evalList
}

// update the table of moves in UI
export const updateMovesTable = (game) => {
   
   // extracting list of moves
   const moves = getMovesList(game)
   const evals = getEvalList(game)
   
   for (let m = 0; m < moves.length; m++) {

      // conditional styling for odd and even rows
      let rowNum = Math.floor(m/2)
      let rowStyle = ''
      if (rowNum%2 == 0) {
         rowStyle = 'dark-row'
      } else {
         rowStyle = 'light-row'
      }

      // inserting move numbers before each pair of moves
      if (m%2 == 0) {
         let moveNumDiv = $('<div></div>').addClass('move-num-div table-element').text((1+(m/2)).toString().concat('.'))
         moveNumDiv.addClass(rowStyle)
         $('#moves-grid').append(moveNumDiv)
      }

      // adding move to the grid
      let moveDiv = $('<div></div>').addClass('move-div').text(moves[m])

      let evalDiv = $('<div></div>').addClass('eval-div').text(getCleanEval(evals[m]))

      let moveEvalPair = $('<div></div>').addClass('container-row move-eval-pair table-element')
      moveEvalPair.append(moveDiv, evalDiv)
      moveEvalPair.addClass(rowStyle)
      moveEvalPair.attr('id', 'move-' + (m+1))

      $('#moves-grid').append(moveEvalPair)
   }

   // appending the result to the table
   let resultDiv = $('<div></div>').addClass('result-div table-element').text(game[0]['result'])
   $('#moves-grid').append(resultDiv)
}

// updates players in UI
export const updatePlayers = (game) => {
   const whitePlayer = game[0]['white']
   const blackPlayer = game[0]['black']

   $("#top-player-name").html(blackPlayer)
   $("#bottom-player-name").html(whitePlayer)
}

// updates the page header with player info
export const updatePageHeader = (playerName) => {
   $(document).ready(() => {
      $('#player-name').text(playerName)
   })
}

// -------------------
// Functions for making our table of games
// -------------------

// cleans the result for display
const getCleanResult = (result) => {

   // tidying the ties
   if (result === "1/2-1/2") {
      return "\u00BD-\u00BD"
   } 
   return result
}

// extracts the first initial and last name
const getCleanName = (name) => {
   let splitNameList = name.split(" ")

   let firstInitial = splitNameList[0][0] + "."
   let lastName = splitNameList[splitNameList.length-1]

   name = firstInitial + " " + lastName

   return name
}

const getRowClass = (g) => {
   return (g%2 == 0 ? 'light-row':'dark-row')
}

// -------------------
// functions for toggling UI
// -------------------

// function for toggling the board
export const toggleBoardFlip = (board) => {
   board.flip()

   let currTopName = $("#top-player-name").html()
   let currBottomName = $("#bottom-player-name").html()
   let currTopColor = $("#top-dot").css('background-color')
   let currBottomColor = $("#bottom-dot").css('background-color')

   $("#top-player-name").html(currBottomName)
   $("#bottom-player-name").html(currTopName)
   $("#top-dot").css('background-color', currBottomColor)
   $("#bottom-dot").css('background-color', currTopColor)

}

// function for toggling the eval
export const toggleEval = (e) => {
   
   if (e.target.value == "Off") {
      e.target.value = "On"
      $(".eval-div").show()
      $("#eval-graph-panel").show()

   } else {
      e.target.value = "Off"
      $(".eval-div").hide()
      $("#eval-graph-panel").hide()
   }
}

export const updateCurrMove = (board, fenArray, currMove) => {
   board.position(fenArray[currMove])

   $('.move-eval-pair').css('border', '1px solid transparent')
   $('#move-' + (currMove)).css('border', '1px solid black')
}

const abbrevName = (longName) => {
   let splitName = longName.split(" ")
   let firstInitial = splitName[0][0] + "."
   let lastName = splitName[splitName.length-1]

   let shortName = firstInitial + " " + lastName
   
   return shortName
}

// creates the game card for each event
export const makeGameCard = (eventGameObj, gameObj, gameNum) => {

   $(document).ready(() => {
       
      // extracting information from the game
      const gameID = eventGameObj['game_id']
      const round = eventGameObj['round']
      const openingName = eventGameObj['opening_name']
      const whitePlayer = eventGameObj['white']
      const blackPlayer = eventGameObj['black']
      const result = eventGameObj['result']


      // creating our cards
      let gameCard = $('<div></div>').addClass('game-card container-col').attr('id', 'game-card-'.concat(gameNum))
      gameCard.click(() => {
         location.href = 'game.html?gameID='.concat(gameID)
      })


      // adding our card header
      let infoHeader = $('<div></div>').addClass('info-header').text('Game '.concat(round).concat(' • '.concat(openingName)))
      gameCard.append(infoHeader)

      // adding our bar graph
      let evalPanel = $('<div></div>').addClass('event-eval-panel container-row').attr('id', 'eval-panel-'.concat(gameNum))
      
      // adding our set of players 
      let playerAxis = $('<div></div>').addClass('player-axis container-col').attr('id', 'player-axis-'.concat(gameNum))
      let whiteDiv = $('<div></div>').addClass("player-div white-player").attr('id', 'white-player-'.concat(gameNum))
      whiteDiv.text(abbrevName(whitePlayer))
      let blackDiv = $('<div></div>').addClass("player-div black-player").attr('id', 'black-player-'.concat(gameNum))
      blackDiv.text(abbrevName(blackPlayer))

      playerAxis.append(whiteDiv, blackDiv)

      let evalGraph = $('<div></div>').addClass('event-eval-graph').attr('id', 'eval-graph-'.concat(gameNum))

      evalPanel.append(playerAxis, evalGraph)

      gameCard.append(evalPanel)

      // card added to document
      $('#content').append(gameCard)

      // for some reason, the graphs need to be drawn last?
      drawBar(gameObj, 'eval-graph-'.concat(gameNum))
   })

  
}

export const makeEventTable = (eventsObj) => {
   for (let event in eventsObj) {

      let rowStyle = ''
      if (event%2 == 0) {
         rowStyle = 'dark-row' 
      } else {
         rowStyle = 'light-row'
      }

      let year = eventsObj[event]['year']
      let champion = eventsObj[event]['champion']
      let challenger = eventsObj[event]['challenger']

      let yearDiv = $('<div></div>').addClass('event-table-div year-div')
      yearDiv.addClass(rowStyle)
      yearDiv.click(() => {
         location.href = 'event.html?eventID='.concat(year + '_' + champion + '_' + challenger)
      })
      yearDiv.text(year)

      let championDiv = $('<div></div>').addClass('event-table-div champion-div')
      championDiv.addClass(rowStyle)
      championDiv.click(() => {
         location.href = 'event.html?eventID='.concat(year + '_' + champion + '_' + challenger)
      })
      championDiv.text(champion)

      let challengerDiv = $('<div></div>').addClass('event-table-div challenger-div')
      challengerDiv.addClass(rowStyle)
      challengerDiv.click(() => {
         location.href = 'event.html?eventID='.concat(year + '_' + champion + '_' + challenger)
      })
      challengerDiv.text(challenger)

      $("#events-grid").append(yearDiv)
      $("#events-grid").append(championDiv)
      $("#events-grid").append(challengerDiv)
   }

}

export const updateEventHeader = (eventID) => {
   let eventIdSplit = eventID.split('_')
   let eventString = eventIdSplit[1] + ' vs ' + eventIdSplit[2] + ', ' + eventIdSplit[0]

   $("#event-header").text(eventString)
}

// brief function for abbreviating the opening
const abbrevOpening = (longOpeningName) => {
   return longOpeningName.split(',')[0]
}

// splits the result for 
const splitResult = (result) => {
   let resultStringSplit = result.split('-')
   let whiteResult = resultStringSplit[0]
   let blackResult = resultStringSplit[1]

   if (whiteResult == '1/2') {
      whiteResult = "\u00BD"
      blackResult = "\u00BD"
   }

   return [whiteResult, blackResult]
}

// builds an individual row for the games table
export const makeGameRow = (eventGameObj, gameObj, gameNum) => {

   $(document).ready(() => {

      let gameID = eventGameObj['game_id']
      let round = eventGameObj['round']
      let white = eventGameObj['white']
      let black = eventGameObj['black']
      let result = eventGameObj['result']

      let whiteStyle = ''
      let blackStyle = ''
      if (result !== '1/2-1/2') {
         if (result == '1-0') {
            whiteStyle = 'victory'
         } else {
            blackStyle = 'victory'
         }
      }

      // adding the round div
      let roundDiv = $('<div></div>').addClass('round-div table-element').attr('id', 'round-div-'.concat(gameNum))
      roundDiv.text(round)

      // building the players div
      let playersDiv = $('<div></div>').addClass('players-div table-element').attr('id', 'players-div-'.concat(gameNum))
      playersDiv.click(() => {
         location.href = 'game.html?gameID='.concat(gameID)
      })

      let whiteDiv = $('<div></div>').addClass('white-div').attr('id', 'white-div-'.concat(gameNum))
      let blackDiv = $('<div></div>').addClass('black-div').attr('id', 'black-div-'.concat(gameNum))
      
      let whiteDot = $("<span></span>").addClass('dot').attr('id', 'white-dot')
      let blackDot = $("<span></span>").addClass('dot').attr('id', 'black-dot')
      
      let whiteNameDiv = $("<div></div>").addClass('white-name-div').attr('id', 'white-name-div-'.concat(gameNum))
      let blackNameDiv = $("<div></div>").addClass('black-name-div').attr('id', 'white-name-div-'.concat(gameNum))

      whiteDiv.append(whiteDot, whiteNameDiv)
      blackDiv.append(blackDot, blackNameDiv)

      whiteNameDiv.text(abbrevName(white))
      blackNameDiv.text(abbrevName(black))

      whiteNameDiv.addClass(whiteStyle)
      blackNameDiv.addClass(blackStyle)

      playersDiv.append(whiteDiv, blackDiv)

      // building the eval div
      let evalDivID = 'eval-div-'.concat(gameNum)
      let evalDiv = $('<div></div>').addClass('eval-div table-element').attr('id', evalDivID)
      evalDiv.click(() => {
         location.href = 'game.html?gameID='.concat(gameID)
      })

      // building the result div
      let resultDiv = $('<div></div>').addClass('result-div table-element').attr('id', 'result-div-'.concat(gameNum))
      resultDiv.click(() => {
         location.href = 'game.html?gameID='.concat(gameID)
      })
      let whiteResultDiv = $('<div></div>').addClass('white-result-div').attr('id', 'white-result-div-'.concat(gameNum))
      let blackResultDiv = $('<div></div>').addClass('black-result-div').attr('id', 'black-result-div-'.concat(gameNum))

      let resultSplit = splitResult(result)
      whiteResultDiv.text(resultSplit[0])
      blackResultDiv.text(resultSplit[1])

      whiteResultDiv.addClass(whiteStyle)
      blackResultDiv.addClass(blackStyle)

      resultDiv.append(whiteResultDiv, blackResultDiv)

      // building the numMoves div
      let numMoves = Math.ceil(gameObj.length / 2)
      let numMovesDiv = $('<div></div>').addClass('num-moves-div table-element').attr('id', 'num-moves-div-'.concat(gameNum))
      numMovesDiv.text(numMoves)
      numMovesDiv.click(() => {
         location.href = 'game.html?gameID='.concat(gameID)
      })

      // building the opening div
      let openingDiv = $('<div></div>').addClass('opening-div table-element').attr('id', 'opening-div-'.concat(gameNum))
      openingDiv.click(() => {
         location.href = 'game.html?gameID='.concat(gameID)
      })
      
      openingDiv.text(abbrevOpening(eventGameObj['opening_name']))

      $("#games-table").append(roundDiv, playersDiv, evalDiv, resultDiv, numMovesDiv, openingDiv)
      drawMiniBar(gameObj, evalDivID)
   })
}