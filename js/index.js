import { makeEventTable } from "./helpers.js"

async function main() {

   // loading the event file
   const eventFilePath = 'json/matches.json'
   const eventJSON = fetch(eventFilePath)
      .then((res) => res.json())
      .then((res) => { return res })

   // loading our event page

   async function loadEventsList() {
      let events = await eventJSON
      makeEventTable(events)

   }

   loadEventsList()
}

main()