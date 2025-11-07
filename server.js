const express = require('express');
const usuarioRoutes = require('./src/routes/usuarioRoutes.js');
const emailRoutes = require('./src/routes/emailRoutes.js');

const app = require('./src/app.js');

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', usuarioRoutes);
app.use('/api', emailRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));