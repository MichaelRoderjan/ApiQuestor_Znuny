// src/database/createTable.js
const { pool } = require('./connection.js');

async function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      login VARCHAR(50) UNIQUE NOT NULL,
      grupo VARCHAR(50) NOT NULL,
      criado_em TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await pool.query(query);
  } catch (err) {
    console.error('Erro ao criar tabela:', err);
  }
}

module.exports = { createTable };
