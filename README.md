# flairchange_bot-api
An API aggregating data coming from r/PoliticalCompassMemes, gathered and processed by u/[flairchange_bot](https://github.com/ornato-t/flairchange_bot).

# Endpoints

Each endpoint can be accessed by opening the url linked on the sidebar. The API supports the following endpoints:

## `GET /u/<name>`
With &lt;name&gt; being a Reddit username.  

Returns a JSON object containing a user's flair history, including the date of each flair change.  
Flair change data is stored in the `flairs` array. Each object represents a change: user `name` changed its flair to `flairs[i].flair` on `flairs[i].dateAdded`.

Returns a 400 error for a badly formulated request or 404 for a missing entry in the database.
### Example
`{`  
&ensp;`"name": "flairchange_bot",`  
&ensp;`"flairs": [{`  
&emsp;`"flair": "AuthCenter",`  
&emsp;`"dateAdded": 2022-04-26T22:29:54.489Z"`  
&ensp;`}, {`  
&emsp;`"flair": "GreyCentrist",`  
&emsp;`"dateAdded": 2022-06-01T00:00:00.000Z"`  
&ensp;`}]`  
`}`  

*Note: this is just an example, flairchange_bot has clearly never changed his flair, as that would make him cringe.*

## `GET /leaderboard`
Returns an array containing the top 50 flair changers of r/PoliticalCompassMemes. Can be followed by a parameter to limit/expand the returned results.
### Example
`[{`  
&emsp;`"name": "flair-checking-bot",`  
&emsp;`"flairs": [],`  
&emsp;`"size": 300,`  
&emsp;`"position": 1`  
&ensp;`}, ...]`  

## `GET /leaderboard/<N>`
With &lt;N&gt; being a natural number.  

Returns an array containing the top N flair changers of r/PoliticalCompassMemes. Doesn't accept a negative parameter or a parameter greater than 500.

The returned values are the same as [/leaderboard](#get-leaderboard).


## `GET /stats`  
Returns a JSON object containing the all the flair statistics of r/PoliticalCompassMemes. It is composed of key-value pairs, composed by a flair and the number of users having such flair. This dataset includes the recently added special "chad" flairs as well as older flairs that are no longer available.
### Example
`{`  
&emsp;`"AuthCenter": "32",`  
&emsp;`"Chad AuthCenter": "1",`  
&emsp;`"Centrist": "20",`  
&emsp;`"GreyCentrist": "40"`  
`}`

## `GET /stats/filter`  
Returns the same data as `/stats` but filters out the *special* flairs (such as "chad", "transhumanist", "grand inquisitor"). Users with filtered flairs are counted as members of their original, non *special* flair. 
### Example
`{`  
&emsp;`"AuthCenter": "33",`  
&emsp;`"Centrist": "20",`  
&emsp;`"GreyCentrist": "40"`  
`}`

## `GET /stats/noAlts`  
Returns the same data as `/stats` but filters out the *alternative* flairs (such as "PurpleLibright" or "GreyCentrist"). Users with filtered flairs are counted as members of their original, non *alternative* flair. 
### Example
`{`  
&emsp;`"AuthCenter": "32",`  
&emsp;`"Chad AuthCenter": "1",`  
&emsp;`"Centrist": "60"`  
`}`


## `GET /stats/filter/noAlts`  
Combines the two previously introduced endpoints. Returns the same data as `/stats` but filters out both the *special* and the *alternative* flairs. Users with filtered flairs are counted as members of their original, non *special*, non *alternative* flair. 
### Example
`{`  
&emsp;`"AuthCenter": "33",`  
&emsp;`"Centrist": "60"`  
`}`


# Access
Access to the API is free and open to all. If you are interested in additional endpoints write a Reddit message to u/Nerd02.