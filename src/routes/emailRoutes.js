// routes/emailRoutes.js
const express = require('express');
const { 
  criarEmail, 
  obterEmails, 
  obterEmailPorLogin, 
  removerEmail,   
} = require('../controllers/emailsController.js');

const router = express.Router();

// Criar novo email
router.post('/emails', criarEmail);

// Listar todos os emails
router.get('/emails', obterEmails);

// Buscar um email específico pelo login
router.get('/emails/:login', obterEmailPorLogin);

// Deletar email pelo ID
router.delete('/emails/:id', removerEmail);

module.exports = router;