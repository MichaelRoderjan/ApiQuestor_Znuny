const {
    adicionarEmails,
    listarEmails,
    removerEmails,
    mostrarEmails,
} = require('../models/emails.js');

// Criar novo email
async function criarEmail(req, res) {
    const { email, senha, grupo } = req.body;
    try {
        const novoEmail = await adicionarEmails(email, senha, grupo);
        res.status(201).json(novoEmail);
    } catch (err) {
        console.error('Erro ao criar email:', err);
        res.status(500).json({ error: 'Erro ao criar email' });
    }
}

// Listar todos os emails
async function obterEmails(req, res) {
    try {
        const emails = await listarEmails();
        res.status(200).json(emails);
    } catch (err) {
        console.error('Erro ao obter emails:', err);
        res.status(500).json({ error: 'Erro ao obter emails' });
    }
}

// Obter email por login
async function obterEmailPorLogin(req, res) {
    const { login } = req.params;
    try {
        const email = await mostrarEmails(login);
        res.status(200).json(email);
    } catch (err) {
        console.error('Erro ao obter email:', err);
        res.status(500).json({ error: 'Erro ao obter email' });
    }
}

// Remover email por ID
async function removerEmail(req, res) {
    const { id } = req.params;
    try {
        await removerEmails(id);
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao remover email:', err);
        res.status(500).json({ error: 'Erro ao remover email' });
    }
}

module.exports = {
    criarEmail,
    obterEmails,
    obterEmailPorLogin,
    removerEmail,
};
