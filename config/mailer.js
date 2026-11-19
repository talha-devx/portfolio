// config/mailer.js
// Sends emails with Nodemailer + Gmail SMTP.
// SMTP credentials come from the .env file (never hard-code passwords!).

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE !== 'false', // true = SSL on port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Gmail "App Password", not your normal password
  },
});

// Returns true only when real SMTP credentials are filled in .env
function isMailConfigured() {
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  return user !== '' && pass !== '' && !user.startsWith('your_');
}

// Called once when the server starts, so you can see in the terminal if SMTP works
async function verifyMailer() {
  if (!isMailConfigured()) {
    console.warn('⚠  SMTP not configured — emails will be skipped (fill SMTP_* in .env)');
    return;
  }
  try {
    await transporter.verify();
    console.log('✔  SMTP ready — connected to', process.env.SMTP_HOST || 'smtp.gmail.com');
  } catch (err) {
    console.error('✖  SMTP login failed:', err.message);
  }
}

// Escape user input before putting it inside the HTML email
function escapeHTML(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Email the site owner when someone submits the contact form.
// Returns true if sent, false otherwise — it never throws.
async function sendContactNotification({ name, email, subject, message }) {
  if (!isMailConfigured()) return false;

  const receiver = process.env.CONTACT_RECEIVER || process.env.SMTP_USER;
  try {
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME || 'Portfolio'}" <${process.env.SMTP_USER}>`,
      to: receiver,
      replyTo: email, // pressing "Reply" in Gmail answers the visitor directly
      subject: `New portfolio message: ${subject}`,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#222;">
          <h2 style="margin:0 0 16px;font-weight:600;">New contact message</h2>
          <p style="margin:4px 0;"><b>From:</b> ${escapeHTML(name)} &lt;${escapeHTML(email)}&gt;</p>
          <p style="margin:4px 0;"><b>Subject:</b> ${escapeHTML(subject)}</p>
          <div style="margin-top:16px;padding:16px;background:#f4f4f5;border-radius:10px;white-space:pre-wrap;">${escapeHTML(message)}</div>
          <p style="margin-top:24px;color:#888;font-size:12px;">Sent from your portfolio contact form</p>
        </div>`,
    });
    console.log(`✉  Contact notification sent to ${receiver}`);
    return true;
  } catch (err) {
    console.error('✖  Email failed:', err.message);
    return false;
  }
}

module.exports = { verifyMailer, sendContactNotification };
