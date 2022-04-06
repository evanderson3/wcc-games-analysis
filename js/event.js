import { makeGameCard } from "./helpers.js"

async function main() {


   // getting the eventID from the url params
   const urlParams = new URLSearchParams(window.location.search)
   const eventID = urlParams.get('eventID')

   // loading the event file
   const eventFilePath = 'json/matches/' + eventID + '.json'
   const eventJSON = fetch(eventFilePath)
      .then((res) => res.json())
      .then((res) => { return res })

   // loading our event page

   async function loadEventPage() {
      let event = await eventJSON
      
      // iterating through games in event
      for (let game in event) {
         let gameID = event[game]['game_id']

         let gameFilePath = 'json/games/' + gameID + '.json'
         let gameJSON = fetch(gameFilePath) 
            .then((res) => res.json())
            .then((res) => { return res })


         let gameObj = await gameJSON

         makeGameCard(event[game], gameObj, game)
      }

   }

   loadEventPage()
}

main()