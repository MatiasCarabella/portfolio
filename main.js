import './style.css';
import { ParticleSystem } from './particles.js';

// Initialize Particles
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem('particles-canvas');

    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Initialize Theme
    initTheme();

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
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('GitHub API failed');

        const data = await response.json();

        // Filter out forks if desired, or just show everything. 
        // For now, let's show non-forks primarily, or just top 6.
        const projects = data.filter(repo => !repo.fork).slice(0, 6);

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

function createProjectCard(repo) {
    return `
    <div class="project-card">
      <h3 class="project-name">${repo.name}</h3>
      <p class="project-desc">${repo.description || 'No description available.'}</p>
      <div class="project-meta">
        <div class="project-lang">
          <span class="lang-dot"></span>
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
