/* home.js — typing effect in the big heading on the Home page */

const phrases = [
  'Flutter Developer.',
  'AI & ML Enthusiast.',
  'Mobile App Builder.',
  'CS Undergraduate.',
];

const typedEl = document.getElementById('typed');
let phraseIndex = 0;
let charIndex = phrases[0].length; // the first phrase is already in the HTML
let isDeleting = true;

function typeLoop() {
  const currentPhrase = phrases[phraseIndex];

  // Add or remove one character
  charIndex += isDeleting ? -1 : 1;
  typedEl.textContent = currentPhrase.slice(0, charIndex);

  let delay = isDeleting ? 40 : 90;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 2000; // pause when the phrase is complete
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length; // next phrase
    delay = 300;
  }

  setTimeout(typeLoop, delay);
}

// Wait 2 seconds on the first phrase, then start
if (typedEl) setTimeout(typeLoop, 2000);
