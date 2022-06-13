require('dotenv').config()

const uri = process.env.MONGODB_URI
const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(uri)

const express = require('express')
const app = express()
const port = process.env.PORT || 80
app.use(express.static('static'))

let arr

run()

//Main function
async function run() {
    arr = await getStats()

    app.listen(port, () => { //Listener
        console.log(`Listeing on https://flairchangebot-api.herokuapp.com/:${port}`)
    })
}

//Handler for GET /stats
app.get('/stats', async(req, res) => {
    try {
        console.log('Answering request for: /stats')
        res.send(arr)
    } catch (err) {
        console.log(err)
    }
})

//Connects to MongoDB and returns the data from the 'stats' collection. Refreshed only once per lifecycle
async function getStats() {
    await client.connect()
    const db = client.db('flairChangeBot').collection('stats')

    let arr = await db.find().toArray()

    client.close()

    return arr
}