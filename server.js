// server.js
// Entry point of the app. Run with:  npm start   (or  npm run dev  for auto-restart)

require('dotenv').config({ quiet: true }); // loads variables from .env into process.env

const path = require('path');
const express = require('express');

const db = require('./config/db');
const { verifyMailer } = require('./config/mailer');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

app.disable('x-powered-by');

// ---------- 1. Body parser ----------
// Lets us read JSON sent by fetch() as req.body
app.use(express.json({ limit: '20kb' }));

// ---------- 2. API routes ----------
app.use('/api/projects', require('./routes/projects'));
app.use('/api/contact', require('./routes/contact'));

// Unknown API URL -> JSON 404
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found.' });
});

// ---------- 3. Pages, CSS, JS, images ----------
// "extensions" lets /about work the same as /about.html
app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));

// Unknown page -> simple 404 message
app.use((req, res) => {
  res.status(404).send('Page not found. <a href="/">Go to the home page</a>');
});

// ---------- 4. Error handler ----------
// Express calls this when something throws (e.g. invalid JSON sent to the API)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request is too large.' });
  }
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

// ---------- 5. Start ----------
// Used by  npm start  on your computer (or any normal Node host like Render).
async function start() {
  // Check required settings
  const required = ['DB_USER', 'DB_NAME'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`✖  Missing in .env: ${missing.join(', ')}  (copy .env.example to .env first)`);
    process.exit(1);
  }

  try {
    await db.query('SELECT 1'); // quick test that MySQL is reachable
    console.log(`✔  Connected to MySQL database "${process.env.DB_NAME}"`);
  } catch (err) {
    console.error('✖  Could not connect to MySQL:', err.message);
    console.error('   → Check DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in .env');
    console.error('   → Create the database first with:  npm run db:setup');
    process.exit(1);
  }

  await verifyMailer();

  app.listen(PORT, () => {
    console.log(`🚀 Portfolio running at http://localhost:${PORT}`);
  });
}

// Only start a server when this file is run directly (node server.js).
// On Vercel, api/index.js imports the app instead and Vercel runs it for each request.
if (require.main === module) {
  start();
}

module.exports = app;
