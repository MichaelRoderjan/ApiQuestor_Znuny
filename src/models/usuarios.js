const { pool } = require('../database/connection.js');
const { createTableUsuarios } = require('../database/createTable.js');

// Função para inserir usuário
async function adicionarUsuario(login, grupo, id_email) {

    // Garantir que a tabela exista antes de inserir
    await createTableUsuarios();

    //Verificar se o usuário já está cadastrado
    const checkQuery = 'SELECT * FROM usuarios WHERE login = $1';
    const checkRes = await pool.query(checkQuery, [login]);

    if (checkRes.rows.length > 0) {
        return { mensagem: 'Usuário já cadastrado', usuario: checkRes.rows[0] };
    }

    const query = `
        INSERT INTO usuarios (login, grupo, id_email)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    try {
        const res = await pool.query(query, [login, grupo, id_email]);
        return res.rows[0];

    } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
        throw error;
    }
}

// Função para listar todos os usuários
async function listarUsuarios() {

    // Garantir que a tabela exista antes de inserir
    await createTableUsuarios();
    try {
        const res = await pool.query('SELECT * FROM usuarios ORDER BY id_usuario DESC');
        return res.rows;

    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        throw error;
    }
}


//Remover usuário pelo ID
async function removerUsuarios(id) {
    // Garantir que a tabela exista antes de inserir
    await createTableUsuarios();
    try {
        const res = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *', [id]);
        return res.rows;

    } catch (error) {
        console.error('Erro ao remover usuário:', error);
        throw error;
    }
}

//Mostrar usuário pelo login
async function mostrarUsuario(login) {
    // Garantir que a tabela exista antes de inserir
    await createTableUsuarios();
    try {
        const res = await pool.query('SELECT * FROM usuarios WHERE login = $1', [login]);
        return res.rows;

    } catch (error) {
        console.error('Erro ao mostrar usuário:', error);
        throw error;
    }
}

async function buscarEmailPorUsuario(login) {
    const query = `
    SELECT e.email, e.senha
    FROM usuarios u
    JOIN emails e ON u.email_id = e.id
    WHERE u.login = $1;
  `;

    try {
        const result = await pool.query(query, [login]);
        return result.rows[0];
    } catch (err) {
        console.error('Erro ao buscar email do usuário:', err);
    }
}

module.exports = {
    adicionarUsuario,
    listarUsuarios,
    removerUsuarios,
    mostrarUsuario,
    buscarEmailPorUsuario
};