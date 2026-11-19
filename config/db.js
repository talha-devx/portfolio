// config/db.js
// Creates ONE shared MySQL connection pool for the whole app.
// A pool re-uses connections instead of opening a new one for every request.
// We use the "promise" version of mysql2 so we can write async/await code.

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
});

// Usage in routes:  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
// db.execute() uses PREPARED STATEMENTS: the "?" placeholders are filled in safely
// by MySQL, which protects us from SQL injection.
module.exports = pool;
