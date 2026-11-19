// routes/contact.js
// Contact form: save the message in MySQL and email the site owner.
//   POST /api/contact

const express = require('express');
const db = require('../config/db');
const { sendContactNotification } = require('../config/mailer');
const { clean, isEmail } = require('../utils/validate');

const router = express.Router();

router.post('/', async (req, res) => {
  const body = req.body || {};
  const name = clean(body.name);
  const email = clean(body.email).toLowerCase();
  const subject = clean(body.subject);
  const message = clean(body.message);

  // 1. Validate input
  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({ error: 'Name must be between 2 and 100 characters.' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (subject.length < 3 || subject.length > 150) {
    return res.status(400).json({ error: 'Subject must be between 3 and 150 characters.' });
  }
  if (message.length < 10 || message.length > 2000) {
    return res.status(400).json({ error: 'Message must be between 10 and 2000 characters.' });
  }

  try {
    // 2. Save in MySQL (prepared statement with ? placeholders)
    await db.execute(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );

    // 3. Email notification to the owner (a mail error does not lose the message)
    const emailSent = await sendContactNotification({ name, email, subject, message });

    res.status(201).json({
      message: 'Thanks! Your message has been sent. I will get back to you soon.',
      emailSent,
    });
  } catch (err) {
    console.error('Contact error:', err.message);
    res.status(500).json({ error: 'Could not send your message. Please try again.' });
  }
});

module.exports = router;
