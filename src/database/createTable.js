const { pool } = require('./connection.js');

async function createTableUsuarios() {

  await createTableEmails()

  const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario SERIAL PRIMARY KEY,
  login VARCHAR(50) UNIQUE NOT NULL,
  grupo VARCHAR(50) NOT NULL,
  id_email INTEGER REFERENCES emails(id_email) ON DELETE SET NULL,
  criado_em TIMESTAMP DEFAULT NOW());   
  `;

  try {
    await pool.query(query);
  } catch (err) {
    console.error('Erro ao criar tabela usuarios:', err);
  }
}


async function createTableEmails() {
  const query = `
    CREATE TABLE IF NOT EXISTS emails (
      id_email SERIAL PRIMARY KEY,
      email VARCHAR(100) UNIQUE NOT NULL,
      senha VARCHAR(100) NOT NULL,
      grupo VARCHAR(50) NOT NULL,
      criado_em TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await pool.query(query);  
  } catch (err) {
    console.error('Erro ao criar tabela emails:', err);
  }
}

module.exports = { createTableUsuarios, createTableEmails };