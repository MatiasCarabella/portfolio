import { ParticleSystem } from './particles.js';
import { translations } from './translations.js';

// Initialize Particles
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem('particles-canvas');

  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Initialize Theme
  initTheme();

  // Initialize Language
  initLanguage();

  // Initialize Active Navigation
  initActiveNavigation();

  // Initialize Hero CTA smooth scroll
  initHeroCTA();

  // Fetch Projects
  fetchProjects();
});

// Theme Logic
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');

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
  // Fetch all repos (GitHub API max is 100 per page)
  const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('GitHub API failed');

    const data = await response.json();

    // Filter out forks and show all non-forks
    const projects = data.filter(repo => !repo.fork);

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
    'C++': '#f34b7d', // Pink
  };
  return colors[language] || '#3b82f6'; // Default primary blue
}

function createProjectCard(repo) {
  const langColor = getLanguageColor(repo.language);
  return `
    <div class="project-card">
      <h3 class="project-name">${repo.name}</h3>
      <p class="project-desc">${repo.description || ''}</p>
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

// Hero CTA and Logo smooth scroll
function initHeroCTA() {
  const ctaButton = document.querySelector('.cta-button');
  const logoButton = document.querySelector('.logo');
  
  if (ctaButton) {
    ctaButton.addEventListener('click', (e) => {
      const href = ctaButton.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  if (logoButton) {
    logoButton.addEventListener('click', (e) => {
      const href = logoButton.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}

// Active Navigation Logic
function initActiveNavigation() {
  const sections = document.querySelectorAll('section[id], main[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    let current = '';
    const scrollY = window.scrollY || window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // Smooth scroll for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });


  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav(); // Initial call
}

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
      // Use innerHTML for elements that may contain HTML (like links)
      if (key === 'about.paragraph2') {
        el.innerHTML = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });

  // Update CV download link
  const cvDownload = document.getElementById('cv-download');
  if (cvDownload) {
    cvDownload.href = lang === 'en' ? '/assets/cvs/CV - Matías Carabella - EN.pdf' : '/assets/cvs/CV - Matías Carabella - ES.pdf';
  }
}
