// api/index.js
// Entry point for Vercel. Vercel sends every /api/... request here
// (see vercel.json) and the Express app from server.js handles it.
// Pages, CSS, JS and images in public/ are served directly by Vercel.

module.exports = require('../server');
