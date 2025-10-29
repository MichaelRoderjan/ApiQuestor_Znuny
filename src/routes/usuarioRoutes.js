// routes/usuarioRoutes.js
const express = require('express');
const { criarUsuario, obterUsuarios, removerUsuario, obterUsuarioPorLogin } = require('../controllers/usuarioController.js');

const router = express.Router();

router.post('/usuarios', criarUsuario);

router.get('/usuarios', obterUsuarios);
router.get('/usuarios/:login', obterUsuarioPorLogin);

router.delete('/usuarios/:id', removerUsuario);

module.exports = router;