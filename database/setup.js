// database/setup.js
// Runs schema.sql using the MySQL login from .env, so you don't need the
// mysql command line tool.   Usage:  npm run db:setup

require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function setup() {
  const dbName = process.env.DB_NAME || 'portfolio_db';
  let sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

  // If you chose a different DB_NAME in .env, use it instead of "portfolio_db"
  sql = sql.replace(/portfolio_db/g, dbName);

  // Connect WITHOUT choosing a database (it may not exist yet)
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true, // schema.sql contains many statements
  });

  await connection.query(sql);

  const [tables] = await connection.query(`SHOW TABLES FROM \`${dbName}\``);
  const [[{ total }]] = await connection.query(`SELECT COUNT(*) AS total FROM \`${dbName}\`.projects`);
  await connection.end();

  console.log(`✔  Database "${dbName}" is ready.`);
  console.log('   Tables:', tables.map((row) => Object.values(row)[0]).join(', '));
  console.log(`   Projects in table: ${total}`);
}

setup().catch((err) => {
  console.error('✖  Database setup failed:', err.message);
  console.error('   → Check DB_USER and DB_PASSWORD in your .env file, and that MySQL is running.');
  process.exit(1);
});
