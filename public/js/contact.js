/* contact.js — sends the contact form to the server with fetch() */

const contactForm = document.getElementById('contactForm');
const contactMessage = document.getElementById('contactMessage');
const contactSubmit = document.getElementById('contactSubmit');

// Check the form in the browser first (the server checks again)
function validateContact(data) {
  if (data.name.length < 2) return 'Please enter your name (at least 2 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) return 'Please enter a valid email address.';
  if (data.subject.length < 3) return 'Please enter a subject (at least 3 characters).';
  if (data.message.length < 10) return 'Your message should be at least 10 characters long.';
  return null;
}

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // stop the normal page reload

  const data = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    subject: document.getElementById('subject').value.trim(),
    message: document.getElementById('message').value.trim(),
  };

  const error = validateContact(data);
  if (error) {
    showFormMessage(contactMessage, error, 'error');
    return;
  }

  setLoading(contactSubmit, true, 'Sending…');
  try {
    const result = await api('/api/contact', 'POST', data);
    showFormMessage(contactMessage, result.message, 'success');
    showToast('Message sent successfully!');
    contactForm.reset();
  } catch (err) {
    showFormMessage(contactMessage, err.message, 'error');
  } finally {
    setLoading(contactSubmit, false);
  }
});
