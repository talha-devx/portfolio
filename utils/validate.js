// utils/validate.js
// Small helper functions used to validate user input on the server.
// (Never trust the browser — always validate again on the backend.)

// Turns any value into a trimmed string ('' if it was not a string)
function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 150;
}

// Route params like /api/projects/7 -> 7 (or null if invalid)
function toId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

module.exports = { clean, isEmail, toId };
