require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST, // Menggunakan PGHOST dari .env
  port: parseInt(process.env.PGPORT), // Menggunakan PGPORT dari .env dan mengubahnya menjadi integer
  database: process.env.PGDATABASE, // Menggunakan PGDATABASE dari .env
  user: process.env.PGUSER, // Menggunakan PGUSER dari .env
  password: process.env.PGPASSWORD, // Menggunakan PGPASSWORD dari .env
});

module.exports = pool;