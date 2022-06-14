# flairchange_bot-api
An API aggregating data coming from r/PoliticalCompassMemes, gathered and processed by u/[flairchange_bot](https://github.com/ornato-t/flairchange_bot).

# Endpoint

Each endpoint can be accessed by opening the runtime environment linked on the sidebar. The API supports the following endpoints:

## `GET /stats`  
Returns a JSON object containing the all the flair statistics of r/PoliticalCompassMemes. It is composed of key-value pairs, composed by a flair and the number of users having such flair. This dataset includes the recently added special "chad" flairs.
### Example
`{`  
&emsp;`"AuthCenter": "32",`  
&emsp;`"Chad AuthCenter": "1",`  
&emsp;`"Centrist": "20",`  
&emsp;`"GreyCentrist": "40"`  
`}`

## `GET /stats/filter`  
Returns the same data as `/stats` but filters out the *special* flairs (such as "chad"). Users with filtered flairs are counted as members of their original, non *special* flair. 
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
Access to the API is free and open to all. As an anti spam precaution, the data is not loaded from the database on each API call but instead fetched and cached by the app for one minute, after that it gets refreshed. Because of this and other possible latency problems caused by u/[flairchange_bot](https://github.com/ornato-t/flairchange_bot)'s data gathering, the API may prove slow to react to real time flair changes.