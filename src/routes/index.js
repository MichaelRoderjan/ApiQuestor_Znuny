const express = require('express');
const router = express.Router()
const emailController = require('../controllers/emailController');

router.post('/enviar-email', emailController.enviarEmail);

const homeController = require('../controllers/homeController');

router.get('/', homeController.home)

module.exports = router;