// routes/projects.js
// Reads the portfolio projects from MySQL.
//   GET /api/projects      -> list all projects
//   GET /api/projects/:id  -> one project
// To add or change projects, edit the "projects" table in MySQL
// (see the INSERT statements in database/schema.sql).

const express = require('express');
const db = require('../config/db');
const { toId } = require('../utils/validate');

const router = express.Router();

// ---------- All projects (newest first) ----------
router.get('/', async (req, res) => {
  try {
    const [projects] = await db.execute('SELECT * FROM projects ORDER BY id DESC');
    res.json({ projects });
  } catch (err) {
    console.error('Load projects error:', err.message);
    res.status(500).json({ error: 'Could not load projects.' });
  }
});

// ---------- One project ----------
router.get('/:id', async (req, res) => {
  const id = toId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid project id.' });

  try {
    const [rows] = await db.execute('SELECT * FROM projects WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Project not found.' });
    res.json({ project: rows[0] });
  } catch (err) {
    console.error('Load project error:', err.message);
    res.status(500).json({ error: 'Could not load the project.' });
  }
});

module.exports = router;
