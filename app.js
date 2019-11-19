const express = require('express')
const apiRouter = require('./routes/apiRouter')
const {invalidRoute, handle405Errors, handleCustomErrors} = require('./error-handler/error-handler')

const app = express()
app.use(express.json())
app.use('/api',apiRouter)
 app.use(handleCustomErrors)


module.exports = app;
