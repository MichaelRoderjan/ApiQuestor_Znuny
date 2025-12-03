const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());

// Lê JSON do corpo da requisição
app.use(express.json());

// (opcional, mas recomendado) lê application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Suas rotas
app.use('/', routes);

module.exports = app;
