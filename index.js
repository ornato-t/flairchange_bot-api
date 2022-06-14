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

    app.listen(port, () => {
        console.log(`Listeing on https://flairchangebot-api.herokuapp.com/:${port}`)
    })
}

app.get('/stats', (req, res) => {
    try {
        console.log('Answering request for: /stats')
        res.send(obj)
    } catch (err) {
        console.log(err)
    }
})

app.get('/stats/noAlts', (req, res) => {
    try {
        console.log('Answering request for: /stats/noAlts')
        res.send(noAlts(obj))
    } catch (err) {
        console.log(err)
    }
})

app.get('/stats/filter/noAlts', (req, res) => {
    try {
        console.log('Answering request for: /stats/filter/noAlts')
        res.send(noAlts(filter()))
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

//Filters out the newly added 'Chad' flairs, groups those users with the regular ones
function filter() {
    let temp = Object()
    let toRemove = Object()
    delim = 'Chad '

    for (el of Object.keys(obj)) {
        if (!el.includes(delim)) {
            temp[el] = obj[el]
        } else {
            orig = el.slice(delim.length)
            toRemove[orig] = obj[el]
        }
    }

    for (el of Object.keys(toRemove)) {
        temp[el] += toRemove[el]
    }
    return temp
}

//Removes alt flairs (GreyCentrist, PurpleLibright) and groups them with the respective main flair
function noAlts(src) {
    alts = {
        GreyCentrist: 'Centrist',
        PurpleLibRight: 'LibRight'
    }
    temp = Object()

    for (el of Object.keys(src)) {
        if (!Object.keys(alts).includes(el)) {
            temp[el] = src[el]
        }
    }

    for (el of Object.keys(alts)) {
        temp[alts[el]] += src[el]
    }

    return temp
}