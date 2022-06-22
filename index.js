require('dotenv').config()

const uri = process.env.MONGODB_URI
const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(uri)

const express = require('express')
const app = express()
const port = process.env.PORT || 80
app.use(express.static('static'))

client.connect()
const db = client.db('flairChangeBot')


app.listen(port, () => {
    console.log(`Listeing...`, port)
})


app.get('/stats', async(req, res) => {
    try {
        console.log('Answering request for: /stats')
        res.send(await getStats())
    } catch (err) {
        console.log(err)
    }
})

app.get('/stats/noAlts', async(req, res) => {
    try {
        console.log('Answering request for: /stats/noAlts')
        res.send(noAlts(await getStats()))
    } catch (err) {
        console.log(err)
    }
})

app.get('/stats/filter', async(req, res) => {
    try {
        console.log('Answering request for: /stats/filter')
        res.send(filter(await getStats()))
    } catch (err) {
        console.log(err)
    }
})

app.get('/stats/filter/noAlts', async(req, res) => {
    try {
        console.log('Answering request for: /stats/filter/noAlts')
        res.send(noAlts(filter(await getStats())))
    } catch (err) {
        console.log(err)
    }
})

app.get('/u/:user', async(req, res) => {
    const regexReddit = /[A-Za-z0-9_-]+/gm //Regex matching a reddit username:A-Z, a-z, 0-9, _, -

    try {
        user = req.params.user
        console.log(`Answering request for: ${user}`)

        if (user.match(regexReddit)) {
            log = await getUser(user)
            if (log != null) {
                res.send(log)
            } else {
                console.log('\tDBERR: 404')
                res.statusCode = 404
                res.send('Error: user not found in the database.')
            }
        } else { //Not a Reddit username
            console.log('\tDBERR: 400')
            res.statusCode = 400
            res.send('Error: not a Reddit username.')
        }

    } catch (err) {
        console.log(err)
    }
})


//Returns the data from the 'stats' collection. Refreshed only once per lifecycle
async function getStats() {
    let base = Object()

    await db.collection('stats').find().forEach(el => {
        if (el.flair == 'null') el.flair = 'Unflaired'
        base[el.flair] = el.num
    })

    const res = Object.keys(base).sort().reduce(
        (obj, key) => {
            obj[key] = base[key]
            return obj
        }, {}
    )

    return res
}

//Returns a user's complete database entry: name, flair history, date of each flair change
async function getUser(user) {
    return await db.collection('PCM_users').findOne({ name: { $regex: new RegExp(user, 'i') } }, { projection: { _id: 0, id: 0, optOut: 0, flair: 0, dateAdded: 0 } }) //REGEX makes search case insensitive
}

//Filters out the newly added 'Chad' flairs, groups those users with the regular ones
function filter(src) {
    let temp = Object()
    let toRemove = Object()
    delim = 'Chad '

    for (el of Object.keys(src)) {
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