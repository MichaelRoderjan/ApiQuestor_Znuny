const bodyParse = require('body-parser')
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());

// Middleware moderno para ler JSON
app.use(bodyParse.json());

app.use('/', routes);

module.exports = app;
