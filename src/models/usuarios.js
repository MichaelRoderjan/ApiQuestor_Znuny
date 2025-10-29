const { pool } = require('../database/connection.js');
const { createTable } = require('../database/createTable.js');

// Função para inserir usuário
async function adicionarUsuario(login, grupo) {

    // Garantir que a tabela exista antes de inserir
    await createTable();

    //Verificar se o usuário já está cadastrado

    const checkQuery = 'SELECT * FROM usuarios WHERE login = $1';
    const checkRes = await pool.query(checkQuery, [login]);

    if (checkRes.rows.length > 0) {
        return { mensagem: 'Usuário já cadastrado', usuario: checkRes.rows[0] };
    }

    const query = `
        INSERT INTO usuarios (login, grupo)
        VALUES ($1, $2)
        RETURNING *;
    `;
    try {
        const res = await pool.query(query, [login, grupo]);
        return res.rows[0];

    } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
        throw error;
    }
}

// Função para listar todos os usuários
async function listarUsuarios() {
    try {
        const res = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
        return res.rows;

    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        throw error;
    }
}


//Remover usuário pelo ID
async function removerUsuarios(id) {
    try {
        const res = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
        return res.rows;

    } catch (error) {
        console.error('Erro ao remover usuário:', error);
        throw error;
    }
}

//Mostrar usuário pelo login
async function mostrarUsuario(login) {
    try {
        const res = await pool.query('SELECT * FROM usuarios WHERE login = $1', [login]);
        return res.rows;

    } catch (error) {
        console.error('Erro ao mostrar usuário:', error);
        throw error;
    }
}

module.exports = {
    adicionarUsuario,
    listarUsuarios,
    removerUsuarios,
    mostrarUsuario
};