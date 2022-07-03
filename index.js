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
                res.statusCode = 404
                res.send('Error: user not found in the database.')
                throw '\tDBERR: 404'
            }
        } else { //Not a Reddit username
            res.statusCode = 400
            res.send('Error: not a Reddit username.')
            throw '\tDBERR: 400'
        }

    } catch (err) {
        console.log(err)
    }
})

app.get('/leaderboard', async(req, res) => {
    try {
        const defaultVal = 50
        console.log(`Answering request for: /leaderboard ${defaultVal} entries`)
        res.send(await getLeaderboard(defaultVal))
    } catch (err) {
        console.log(err)
    }
})

app.get('/leaderboard/:n', async(req, res) => {
    try {
        const defaultVal = 500
        let n = Math.floor(Number(req.params.n))

        if (n > defaultVal) //Requested num is too big, limit to const
            n = defaultVal
        else if (n <= 0) { //Negative or zero param
            res.statusCode = 400
            res.send('Error: param should be greater than zero.')
            throw 'PARAM_ERR: 400'
        }
        console.log(`Answering request for: /leaderboard ${n} entries`)
        res.send(await getLeaderboard(n))
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
    return await db.collection('users').findOne({ name: { $regex: new RegExp(user, 'i') } }, { projection: { _id: 0, id: 0, optOut: 0, flair: 0, dateAdded: 0 } }) //REGEX makes search case insensitive
}

//Filters out the newly added 'Chad' flairs and older flairs no longer available, groups those users with the regular ones
function filter(src) {
    let temp = Object(),
        toRemove = Object(),
        delim = 'Chad ',
        centrist = ['Grand Inquisitor', 'Transhumanist'],
        authcenter = ['Authoritarian']

    for (el of Object.keys(src)) {
        toRemove[el] = 0
        if (el.includes(delim)) {
            orig = el.slice(delim.length)
            toRemove[orig] += src[el]
        } else if (centrist.includes(el)) {
            toRemove['Centrist'] += src[el]
        } else if (authcenter.includes(el)) {
            toRemove['AuthCenter'] += src[el]
        } else {
            temp[el] = src[el]
        }
    }

    for (el of Object.keys(toRemove)) {
        if (toRemove[el] > 0)
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

//Returns n elements from the leaderboard
async function getLeaderboard(n) {
    return await db.collection('leaderboard').find({}, { projection: { id: 0 } }).limit(n).toArray()
}