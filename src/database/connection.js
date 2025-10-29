// src/database/connection.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.HOST_POSTGRESQL,
  port: process.env.PORT_POSTGRESQL,
  database: process.env.DATABASE_POSTGRESQL,
  user: process.env.USER_POSTGRESQL,
  password: process.env.PASSWORD_POSTGRESQL,
});

module.exports = { pool };
