require('dotenv').config()

const uri = process.env.MONGODB_URI
const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(uri)

const express = require('express')
const app = express()
const port = process.env.PORT || 80
app.use(express.static('static'))

let obj

run()

//Main function
async function run() {
    obj = await getStats()

    app.listen(port, () => { //Listener
        console.log(`Listeing on https://flairchangebot-api.herokuapp.com/:${port}`)
    })
}

//Handler for GET /stats
app.get('/stats', async(req, res) => {
    try {
        console.log('Answering request for: /stats')
        res.send(obj)
    } catch (err) {
        console.log(err)
    }
})

//Connects to MongoDB and returns the data from the 'stats' collection. Refreshed only once per lifecycle
async function getStats() {
    let base = Object()

    await client.connect()
    const db = client.db('flairChangeBot').collection('stats')

    await db.find().forEach(el => {
        if (el.flair == 'null') el.flair = 'Unflaired'
        base[el.flair] = el.num
    })

    client.close()

    const res = Object.keys(base).sort().reduce(
        (obj, key) => {
            obj[key] = base[key];
            return obj;
        }, {}
    )

    return res
}