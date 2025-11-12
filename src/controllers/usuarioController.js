const { adicionarUsuario,
    listarUsuarios,
    removerUsuarios,
    mostrarUsuario,
    buscarEmailPorUsuario,
    buscarEmailSenhaPorUsuario } = require('../models/usuarios.js');

async function criarUsuario(req, res) {
    const { login, grupo, id_email } = req.body
    try {
        const usuario = await adicionarUsuario(login, grupo, id_email);
        res.status(201).json(usuario);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
}

//Retorna todos os usuários
async function obterUsuarios(req, res) {
    try {
        const usuarios = await listarUsuarios();
        res.status(200).json(usuarios);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao obter usuários' });
    }
}

//Retorna um usuario pelo login
async function obterUsuarioPorLogin(req, res) {
    const { login } = req.params;
    try {
        const usuario = await mostrarUsuario(login);
        res.status(200).json(usuario);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao obter usuário' });
    }
}

async function removerUsuario(req, res) {
    const { id } = req.params;
    try {
        await removerUsuarios(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Erro ao remover usuário' });
    }
}

// Buscar email e senha de acordo com o usuário
async function buscarEmailUsuario(req, res) {
    const { login } = req.params;
    try {
        const resultado = await buscarEmailPorUsuario(login);
        res.status(200).json(resultado);
    } catch (err) {
        console.error('Erro ao buscar email por usuário:', err);
        res.status(500).json({ error: 'Erro ao buscar email do usuário' });
    }
}

// Buscar email e senha de acordo com o usuário
async function buscarEmailSenhaUsuario(req, res) {
    const { login } = req.params;
    try {
        const resultado = await buscarEmailSenhaPorUsuario(login);
        res.status(200).json(resultado);
    } catch (err) {
        console.error('Erro ao buscar email por usuário:', err);
        res.status(500).json({ error: 'Erro ao buscar email do usuário' });
    }
}

module.exports = {
    criarUsuario,
    obterUsuarios,
    removerUsuario,
    obterUsuarioPorLogin,
    buscarEmailUsuario,
    buscarEmailSenhaUsuario
};