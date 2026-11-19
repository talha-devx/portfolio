/* =========================================================
   main.js — shared code loaded on EVERY page
   - helper functions (api, escapeHTML, toasts, form messages)
   - navbar: mobile menu + active link
   - scroll reveal animation
   ========================================================= */

// ---------- Helpers (used by the other page scripts) ----------

// Escape text before putting it inside innerHTML (prevents XSS attacks)
function escapeHTML(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Small wrapper around fetch() for our JSON API.
// Usage:  const data = await api('/api/projects');
//         await api('/api/contact', 'POST', { name: '...' });
async function api(url, method = 'GET', body) {
  const options = { method, headers: {} };
  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error('Cannot reach the server. Is it running?');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }
  return data;
}

// Small pop-up notification in the bottom-right corner
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Show a coloured message box above a form. type = 'success' | 'error'
function showFormMessage(element, text, type) {
  element.textContent = text;
  element.className = `form-message show ${type}`;
}

// Disable a button and change its text while a request is running
function setLoading(button, isLoading, loadingText = 'Please wait…') {
  if (isLoading) {
    button.dataset.label = button.innerHTML;
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.innerHTML = button.dataset.label || button.innerHTML;
    button.disabled = false;
  }
}

// ---------- Navbar ----------
function setupNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!navbar) return;

  // Thin line under the navbar after scrolling a little
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Mobile hamburger menu
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Highlight the link of the current page
  const currentPage = location.pathname.split('/').pop().replace('.html', '') || 'index';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    if (link.getAttribute('href').replace('.html', '') === currentPage) {
      link.classList.add('active');
    }
  });
}

// ---------- Scroll reveal animation ----------
// Adds the class "visible" to .reveal elements when they scroll into view.
const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

// Call again after adding new elements to the page (e.g. project cards)
function revealOnScroll(container = document) {
  container.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add('visible');
  });
}

// ---------- Run on every page ----------
setupNavbar();
revealOnScroll();
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
