import { getGamesArray, makeGamesTable, updatePageHeader } from './helpers.js'

// main scripting function
async function main() {
   
   // getting playerId and playerName from url params
   const urlParams = new URLSearchParams(window.location.search)
   const playerIdParam = urlParams.get('playerID')
   const playerId = playerIdParam.replace("_", '')
   const playerName = playerIdParam.replace("_", ' ')

   // updating page header
   updatePageHeader(playerName)

   // fetching player data file
   const playerFilePath = 'json/'.concat(playerId, '.json')
   const playerJSON = fetch(playerFilePath)
      .then((res) => res.json())
      .then((res) => { return res })

   // using data files to generate the page
   async function loadPage() {

      // reading in player games
      const games = await playerJSON
      let gamesArray = getGamesArray(games)

      // making table of player games
      makeGamesTable(gamesArray)

      // making graph of player ratings
   }

   loadPage()
}
 
main()