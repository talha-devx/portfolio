// routes/contact.js
// Contact form: email the message to the site owner (no database).
//   POST /api/contact

const express = require('express');
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

  // 2. Email the message to the owner. There is no database, so if the
  //    email fails the message would be lost — tell the visitor to retry.
  const emailSent = await sendContactNotification({ name, email, subject, message });
  if (!emailSent) {
    return res.status(500).json({ error: 'Could not send your message. Please try again later.' });
  }

  res.status(201).json({
    message: 'Thanks! Your message has been sent. I will get back to you soon.',
  });
});

module.exports = router;
