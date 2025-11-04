// Conexão na API com o banco de dados PostgreSQL
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.HOST_API,
  port: process.env.PORT_API,
  database: process.env.DATABASE_API,
  user: process.env.USER_API,
  password: process.env.PASSWORD_API,
});

module.exports = { pool };
