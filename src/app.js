const express = require('express');
const bodyParse = require('body-parser')
const cors = require('cors')
const routes = require('./routes')

const app = express()

app.use(cors())
app.use(bodyParse.json()); // Para ler JSON no corpo da requisição

app.use('/', routes)

module.exports = app;