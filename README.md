# flairchange_bot-api
An API aggregating data coming from r/PoliticalCompassMemes, gathered and processed by u/[flairchange_bot](https://github.com/ornato-t/flairchange_bot).

# Endpoints

Each endpoint can be accessed by opening the runtime environment linked on the sidebar. The API supports the following endpoints:

## `GET /u/<name>`
With &lt;name&gt; being a Reddit username.  
Returns a JSON object containing a user's flair history, including the date of each flair change.  
Flair change data should be read as follows: user `name` changed their flair from `flair[i-1]` to `flair[i]` on `dateAdded[i]`.  
Returns a 400 error for a badly formulated request or 404 for a missing entry in the database.
### Example
`{`  
&ensp;`"name": "flairchange_bot",`  
&ensp;`"flair": [`  
&emsp;`"AuthCenter"`  
&ensp;`],`  
&ensp;`"dateAdded": [`  
&emsp;`"2022-04-26T22:29:54.489Z"`  
&ensp;`]`  
`}`

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
Access to the API is free and open to all. If you are interested in additional endpoints write a Reddit message to u/Nerd02.