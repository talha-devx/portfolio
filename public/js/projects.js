/* projects.js — loads projects from data/projects.js (via the API) and shows them as cards */

const projectsGrid = document.getElementById('projectsGrid');
const projectFilters = document.getElementById('projectFilters');
let allProjects = [];

// Technology name (lower case) -> logo file in images/icons/
const techIcons = {
  'python': 'python',
  'pytorch': 'pytorch',
  'scikit-learn': 'scikitlearn',
  'streamlit': 'streamlit',
  'html': 'html5',
  'css': 'css3',
  'javascript': 'javascript',
  'flutter': 'flutter',
  'dart': 'dart',
  'react': 'react',
  'node.js': 'nodejs',
  'mysql': 'mysql',
  'mongodb': 'mongodb',
  'java': 'java',
  'c++': 'cplusplus',
  'figma': 'figma',
  'git': 'git',
  'numpy': 'numpy',
  'pandas': 'pandas',
  'jupyter notebook': 'jupyter',
};

// One small pill for a technology, with its logo if we have one
function techChipHTML(name) {
  const icon = techIcons[name.toLowerCase()];
  const img = icon ? `<img src="images/icons/${icon}.svg" alt="">` : '';
  return `<span class="chip chip-sm">${img}${escapeHTML(name)}</span>`;
}

// Turn the description into a bullet list when it has several lines
function descriptionHTML(text) {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  if (lines.length <= 1) {
    return `<p class="project-desc">${escapeHTML(text)}</p>`;
  }
  return `<ul class="project-desc">${lines.map((line) => `<li>${escapeHTML(line)}</li>`).join('')}</ul>`;
}

// Build the HTML for one project card
function projectCardHTML(project, index) {
  const techChips = project.tech_stack
    .split(',')
    .map((tech) => tech.trim())
    .filter(Boolean)
    .map(techChipHTML)
    .join('');

  const link = project.project_url
    ? `<a href="${escapeHTML(project.project_url)}" class="btn btn-outline btn-sm project-link" target="_blank" rel="noopener">
         View project
         <svg class="icon icon-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
       </a>`
    : '';

  return `
    <article class="card card-hover project-card reveal" style="--d:${index % 2}">
      <div class="project-top">
        <span class="project-category">${escapeHTML(project.category)}</span>
        <span class="project-index">${String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3>${escapeHTML(project.title)}</h3>
      ${descriptionHTML(project.description)}
      <div class="chips">${techChips}</div>
      ${link}
    </article>`;
}

function renderProjects(category) {
  const list = category === 'All'
    ? allProjects
    : allProjects.filter((project) => project.category === category);

  if (list.length === 0) {
    projectsGrid.innerHTML = '<div class="empty-state card">No projects found.</div>';
    return;
  }
  projectsGrid.innerHTML = list.map(projectCardHTML).join('');
  revealOnScroll(projectsGrid); // fade the new cards in (function from main.js)
}

// One filter button per category (+ "All")
function renderFilters() {
  const categories = ['All', ...new Set(allProjects.map((project) => project.category))];
  if (categories.length <= 2) {
    projectFilters.innerHTML = ''; // no need for filters with only one category
    return;
  }
  projectFilters.innerHTML = categories
    .map((category, i) => `<button type="button" class="filter-btn${i === 0 ? ' active' : ''}" data-category="${escapeHTML(category)}">${escapeHTML(category)}</button>`)
    .join('');
}

projectFilters.addEventListener('click', (event) => {
  const button = event.target.closest('.filter-btn');
  if (!button) return;
  projectFilters.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');
  renderProjects(button.dataset.category);
});

async function loadProjects() {
  // Loading placeholders while waiting for the server
  projectsGrid.innerHTML = '<div class="card skeleton"></div>'.repeat(2);

  try {
    const { projects } = await api('/api/projects');
    allProjects = projects;
    renderFilters();
    renderProjects('All');
  } catch (err) {
    projectsGrid.innerHTML = `<div class="empty-state error card">${escapeHTML(err.message)}</div>`;
  }
}

loadProjects();
