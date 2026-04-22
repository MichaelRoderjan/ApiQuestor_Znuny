const express = require('express');
const router = express.Router()
const emailController = require('../controllers/emailController');
const questorController = require('../controllers/questorController');
const homeController = require('../controllers/homeController');
const tareffa = require('../controllers/tareffaController')

//Rotas GET
router.get('/', homeController.home)
router.get('/contatos', questorController.getContatos);
router.get('/tareffa', tareffa.getAllTareffa);

//Rotas POST
router.post('/enviar-email', emailController.enviarEmail);

module.exports = router;