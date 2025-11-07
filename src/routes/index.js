const express = require('express');
const router = express.Router()
const emailController = require('../controllers/emailController');
const questorController = require('../controllers/questorController');
const homeController = require('../controllers/homeController');

//Rotas GET
router.get('/', homeController.home)
router.get('/contatos', questorController.getContatos);


//Rotas POST
router.post('/enviar-email', emailController.enviarEmail);

module.exports = router;