const express = require('express');
const router = express.Router();

const { getAllTareffa } = require('../controllers/tareffaController.js');

router.get('/tareffa', getAllTareffa);

module.exports = router;
