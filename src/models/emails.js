const { pool } = require('../database/connection.js');
const { createTableUsuarios, createTableEmails } = require('../database/createTable.js');

// Função para inserir usuário
async function adicionarEmails(email, senha, grupo) {

    // Garantir que a tabela Email exista antes de inserir
    await createTableEmails();

    //Verificar se o usuário já está cadastrado
    const checkQuery = 'SELECT * FROM emails WHERE email = $1';
    const checkRes = await pool.query(checkQuery, [email]);

    if (checkRes.rows.length > 0) {
        return { mensagem: 'Usuário já cadastrado', usuario: checkRes.rows[0] };
    }

    const query = `
        INSERT INTO emails (email, senha,grupo)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    try {
        const res = await pool.query(query, [email, senha, grupo]);
        return res.rows[0];

    } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
        throw error;
    }
}

// Função para listar todos os usuários
async function listarEmails() {
    try {
        const res = await pool.query('SELECT * FROM emails ORDER BY id_email DESC');
        return res.rows;

    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        throw error;
    }
}

//Remover usuário pelo ID
async function removerEmails(id) {
    try {
        const res = await pool.query('DELETE FROM emails WHERE id_email = $1 RETURNING *', [id]);
        return res.rows;

    } catch (error) {
        console.error('Erro ao remover usuário:', error);
        throw error;
    }
}

//Mostrar Email
async function mostrarEmails(email_id) {
    try {
        const res = await pool.query('SELECT * FROM emails WHERE id_email = $1', [email_id]);
        return res.rows;

    } catch (error) {
        console.error('Erro ao mostrar Emails:', error);
        throw error;
    }
}

async function mostrarGrupoEmails(grupo) {
    try {
        const res = await pool.query('SELECT * FROM emails WHERE grupo = $1', [grupo]);
        return res.rows;

    } catch (error) {
        console.error('Erro ao mostrar Grupo:', error);
        throw error;
    }
}

module.exports = {
    adicionarEmails,
    listarEmails,
    removerEmails,
    mostrarEmails,
    mostrarGrupoEmails
};