# flairchange_bot-api
An API returning data gathered and processed by flairchange_bot.

# Endpoint

`GET /stats`  
Returns a JSON object containing the flair statistics of r/PoliticalCompassMemes. It is composed of key-value pairs, composed by a flair and the number of users having such flair.
## Example
`{`  
&emsp;`"Centrist": "20",`  
&emsp;`"GreyCentrist": "40"`  
`}`



# Access
At the moment the app does not feature any access measure. Instead, as a security precaution, the data is only loaded once per app lifecycle. Any database update occurring during the app's lifecycle will only be displayed on the next lifecylce.