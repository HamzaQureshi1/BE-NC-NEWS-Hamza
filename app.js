const express = require('express')
const apiRouter = require('./routes/apiRouter')
const {invalidRoute, handle405Errors, handleCustomErrors, psqlErrors} = require('./error-handler/error-handler')

const app = express()
app.use(express.json())
app.use('/api',apiRouter)
app.use(psqlErrors)
// app.all("/*", (req, res, next) => res.status(404).send("Route not found"));this will catch any routes not found in our app
 app.use(handleCustomErrors)


module.exports = app;
