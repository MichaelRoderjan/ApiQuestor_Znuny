// routes/usuarioRoutes.js
const express = require('express');
const { criarUsuario, obterUsuarios, removerUsuario, obterUsuarioPorLogin, buscarEmailUsuario } = require('../controllers/usuarioController.js');

const router = express.Router();

router.post('/usuarios', criarUsuario);

router.get('/usuarios', obterUsuarios);
router.get('/usuarios/:login', obterUsuarioPorLogin);

// Buscar email e senha vinculados a um usuário
router.get('/emails/usuario/:login', buscarEmailUsuario);

router.delete('/usuarios/:id', removerUsuario);

module.exports = router;