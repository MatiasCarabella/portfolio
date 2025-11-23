import './style.css';
import { ParticleSystem } from './particles.js';

// Initialize Particles
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem('particles-canvas');

  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Initialize Theme
  initTheme();

  // Initialize Language
  initLanguage();

  // Fetch Projects
  fetchProjects();
});

// Theme Logic
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  // Check for saved user preference, if any, on load of the website
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme == 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (currentTheme == 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else if (prefersDarkScheme.matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  themeToggle.addEventListener('click', function () {
    let theme = 'light';
    if (document.documentElement.getAttribute('data-theme') !== 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      theme = 'dark';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      theme = 'light';
    }
    localStorage.setItem('theme', theme);
  });
}

// GitHub Projects Logic
async function fetchProjects() {
  const projectsGrid = document.getElementById('projects-grid');
  const username = 'MatiasCarabella';
  // Increased per_page to fetch more repos
  const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=12`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('GitHub API failed');

    const data = await response.json();

    // Filter out forks if desired, or just show everything. 
    // Showing top 12 non-forks
    const projects = data.filter(repo => !repo.fork).slice(0, 12);

    if (projects.length === 0) {
      renderPlaceholders(projectsGrid);
      return;
    }

    projectsGrid.innerHTML = projects.map(repo => createProjectCard(repo)).join('');

  } catch (error) {
    console.error('Error fetching repos:', error);
    renderPlaceholders(projectsGrid);
  }
}

function getLanguageColor(language) {
  const colors = {
    'JavaScript': '#f7df1e', // Yellow
    'TypeScript': '#3178c6', // Blue
    'HTML': '#e34c26', // Orange
    'CSS': '#563d7c', // Purple
    'Java': '#b07219', // Orange/Brown
    'Python': '#3572a5', // Blue
    'C#': '#178600', // Green
    'Vue': '#41b883', // Green
    'React': '#61dafb', // Cyan
    'Shell': '#89e051', // Green
    'Go': '#00add8', // Cyan
    'Rust': '#dea584', // Brown
    'PHP': '#4f5d95', // Purple
    'Ruby': '#701516', // Red
  };
  return colors[language] || '#3b82f6'; // Default primary blue
}

function createProjectCard(repo) {
  const langColor = getLanguageColor(repo.language);
  return `
    <div class="project-card">
      <h3 class="project-name">${repo.name}</h3>
      <p class="project-desc">${repo.description || 'No description available.'}</p>
      <div class="project-meta">
        <div class="project-lang">
          <span class="lang-dot" style="background-color: ${langColor}"></span>
          <span>${repo.language || 'Code'}</span>
        </div>
        <a href="${repo.html_url}" target="_blank" class="project-link">View Code</a>
      </div>
    </div>
  `;
}

function renderPlaceholders(container) {
  // Fallback content if API fails or no repos found
  const placeholders = [
    { name: 'Portfolio V1', desc: 'My first portfolio website built with HTML/CSS.', lang: 'HTML' },
    { name: 'E-commerce API', desc: 'RESTful API for an online store using Node.js and Express.', lang: 'JavaScript' },
    { name: 'Task Manager', desc: 'A productivity app to manage daily tasks and goals.', lang: 'TypeScript' },
    { name: 'Weather Dashboard', desc: 'Real-time weather tracking application using external APIs.', lang: 'React' },
  ];

  container.innerHTML = placeholders.map(p => `
    <div class="project-card">
      <h3 class="project-name">${p.name}</h3>
      <p class="project-desc">${p.desc}</p>
      <div class="project-meta">
        <div class="project-lang">
          <span class="lang-dot"></span>
          <span>${p.lang}</span>
        </div>
        <span class="project-link" style="cursor: not-allowed; opacity: 0.5;">Coming Soon</span>
      </div>
    </div>
  `).join('');
}

// Language Logic
const translations = {
  en: {
    'nav.stack': 'Stack',
    'nav.projects': 'Projects',
    'hero.subtitle': 'Backend Software Engineer',
    'hero.description': 'Building robust, scalable systems and exploring modern technologies.',
    'hero.cta': 'View Projects',
    'stack.title': 'Technology Stack',
    'projects.title': 'My Projects',
    'projects.loading': 'Loading projects...',
    'footer.rights': 'All rights reserved.'
  },
  es: {
    'nav.stack': 'Tecnologías',
    'nav.projects': 'Proyectos',
    'hero.subtitle': 'Ingeniero de Software Backend',
    'hero.description': 'Construyendo sistemas robustos y escalables, explorando tecnologías modernas.',
    'hero.cta': 'Ver Proyectos',
    'stack.title': 'Stack Tecnológico',
    'projects.title': 'Mis Proyectos',
    'projects.loading': 'Cargando proyectos...',
    'footer.rights': 'Todos los derechos reservados.'
  }
};

function initLanguage() {
  const langToggle = document.getElementById('lang-toggle');
  const savedLang = localStorage.getItem('language') || 'en';

  // Set initial state
  setLanguage(savedLang);

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const currentLang = document.documentElement.getAttribute('lang') || 'en';
      const newLang = currentLang === 'en' ? 'es' : 'en';
      setLanguage(newLang);
    });
  }
}

function setLanguage(lang) {
  document.documentElement.setAttribute('lang', lang);
  localStorage.setItem('language', lang);

  // Update toggle text
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.textContent = lang.toUpperCase();
  }

  // Update text content
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}
