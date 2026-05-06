const mysql = require('mysql2/promise');

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root', // Set your MySQL username here
  DB_PASSWORD = '', // Set your MySQL password here
  DB_NAME = 'salon_db'
} = process.env;

let pool;

async function init() {
  const initConnection = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD
  });

  await initConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await initConnection.end();

  pool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Drop existing tables to ensure a clean slate

  await pool.query(`DROP TABLE IF EXISTS appointments`);
  await pool.query(`DROP TABLE IF EXISTS users`);

  // Create users table

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(150) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(id)
    )
  `);

  // Create appointments table with foreign key to users

  await pool.query(`
    CREATE TABLE appointments (
      appointment_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      user_id INT UNSIGNED NOT NULL,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      style VARCHAR(100) NOT NULL,
      preferred_date DATE NOT NULL,
      preferred_time TIME NOT NULL,
      notes TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(appointment_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
}

const db = {
  init,
  get(sql, params, callback) {
    pool
      .execute(sql, params)
      .then(([rows]) => callback(null, rows[0] || null))
      .catch(callback);
  },

  all(sql, params, callback) {
    pool
      .execute(sql, params)
      .then(([rows]) => callback(null, rows))
      .catch(callback);
  },

  run(sql, params, callback) {
    pool
      .execute(sql, params)
      .then(([result]) => callback(null, result))
      .catch(callback);
  }
};

module.exports = db;
