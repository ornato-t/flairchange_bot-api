# flairchange_bot-api
An API returning data gathered and processed by flairchange_bot.

# Endpoint

`GET /stats`  
Returns an array of JSON objects containing the flair statistics of r/PoliticalCompassMemes. Each object represents a flair and is composed of two fields: `flair` and `num`.  
## Example
`[{`  
&emsp;`"flair": "Centrist"`  
&emsp;`"num": "20"`  
`},`
`{`  
&emsp;`"flair": "GreyCentrist"`  
&emsp;`"num": "40"`  
`}]`



# Access
At the moment the app does not feature any access measure. Instead, as a security precaution, the data is only loaded once per app lifecycle. Any database occurring during the app lifecycle will only be displayed on the next lifecylce.