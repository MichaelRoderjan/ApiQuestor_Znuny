const { getUserLoginTareffa } = require('../models/tareffa.js');

async function getAllTareffa(req, res) {
    try {
        const credentials = getUserLoginTareffa();

        return res.status(200).json(credentials);
    } catch (err) {
        return res.status(500).json({ error: 'Erro ao buscar informações' });
    }
}

module.exports = { getAllTareffa };
