// routes/projects.js
// CRUD for portfolio projects — no database. Projects start from data/projects.js
// and are kept in server memory, so changes made through the API last until the
// server restarts (on Vercel, until the serverless instance is recycled).
// To change projects permanently, edit data/projects.js.
//
//   GET    /api/projects      -> list all projects (newest first)
//   GET    /api/projects/:id  -> one project
//   POST   /api/projects      -> create a project     (needs x-admin-key header)
//   PUT    /api/projects/:id  -> update a project     (needs x-admin-key header)
//   DELETE /api/projects/:id  -> delete a project     (needs x-admin-key header)

const express = require('express');
const initialProjects = require('../data/projects');
const { clean, toId } = require('../utils/validate');

const router = express.Router();

// In-memory "table" (a copy, so data/projects.js itself is never changed)
let projects = initialProjects.map((p) => ({ ...p }));
let nextId = Math.max(0, ...projects.map((p) => p.id)) + 1;

// ---------- Only the owner may create / update / delete ----------
// Set ADMIN_KEY in .env (or Vercel env vars) and send it as the "x-admin-key" header.
function requireAdmin(req, res, next) {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    return res.status(403).json({ error: 'Editing is disabled. Set ADMIN_KEY in .env to enable it.' });
  }
  if (req.get('x-admin-key') !== adminKey) {
    return res.status(401).json({ error: 'Wrong or missing admin key.' });
  }
  next();
}

// ---------- Validate the body of POST / PUT ----------
// Returns { error } or { project } with cleaned values.
function validateProject(body) {
  body = body || {};
  const project = {
    title: clean(body.title),
    category: clean(body.category),
    description: clean(body.description),
    tech_stack: clean(body.tech_stack),
    project_url: clean(body.project_url) || null,
  };

  if (project.title.length < 2 || project.title.length > 150) {
    return { error: 'Title must be between 2 and 150 characters.' };
  }
  if (project.category.length < 2 || project.category.length > 80) {
    return { error: 'Category must be between 2 and 80 characters.' };
  }
  if (project.description.length < 10 || project.description.length > 2000) {
    return { error: 'Description must be between 10 and 2000 characters.' };
  }
  if (project.tech_stack.length < 1 || project.tech_stack.length > 255) {
    return { error: 'Tech stack must be between 1 and 255 characters.' };
  }
  if (project.project_url && !/^https?:\/\/\S+$/.test(project.project_url)) {
    return { error: 'Project URL must start with http:// or https://' };
  }
  if (project.project_url && project.project_url.length > 255) {
    return { error: 'Project URL is too long.' };
  }
  return { project };
}

// ---------- READ: all projects (newest first) ----------
router.get('/', (req, res) => {
  const sorted = [...projects].sort((a, b) => b.id - a.id);
  res.json({ projects: sorted });
});

// ---------- READ: one project ----------
router.get('/:id', (req, res) => {
  const id = toId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid project id.' });

  const project = projects.find((p) => p.id === id);
  if (!project) return res.status(404).json({ error: 'Project not found.' });
  res.json({ project });
});

// ---------- CREATE ----------
router.post('/', requireAdmin, (req, res) => {
  const { error, project } = validateProject(req.body);
  if (error) return res.status(400).json({ error });

  const created = { id: nextId++, ...project };
  projects.push(created);
  res.status(201).json({ message: 'Project created.', project: created });
});

// ---------- UPDATE ----------
router.put('/:id', requireAdmin, (req, res) => {
  const id = toId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid project id.' });

  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Project not found.' });

  const { error, project } = validateProject(req.body);
  if (error) return res.status(400).json({ error });

  projects[index] = { id, ...project };
  res.json({ message: 'Project updated.', project: projects[index] });
});

// ---------- DELETE ----------
router.delete('/:id', requireAdmin, (req, res) => {
  const id = toId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid project id.' });

  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Project not found.' });

  const [deleted] = projects.splice(index, 1);
  res.json({ message: 'Project deleted.', project: deleted });
});

module.exports = router;
