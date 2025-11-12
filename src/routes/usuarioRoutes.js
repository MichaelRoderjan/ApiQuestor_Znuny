// routes/usuarioRoutes.js
const express = require('express');
const { criarUsuario, obterUsuarios, removerUsuario, obterUsuarioPorLogin, buscarEmailUsuario, buscarEmailSenhaUsuario } = require('../controllers/usuarioController.js');

const router = express.Router();

router.post('/usuarios', criarUsuario);

router.get('/usuarios', obterUsuarios);
router.get('/usuarios/:login', obterUsuarioPorLogin);

//Buscando apenas email
router.get('/emails/usuario/:login', buscarEmailUsuario);

//Buscando email e senha
router.get('/emails/usuario/:login/senha', buscarEmailSenhaUsuario);


router.delete('/usuarios/:id', removerUsuario);

module.exports = router;