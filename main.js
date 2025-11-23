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

  // Initialize Active Navigation
  initActiveNavigation();

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

// Language Logic
const translations = {
  en: {
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.stack': 'Stack',
    'nav.projects': 'Projects',
    'nav.cv': 'CV',
    'hero.subtitle': 'Software Engineer',
    'hero.description': 'Building scalable systems and exploring the potential of the latest technologies 🚀',
    'hero.cta': 'About Me',
    'experience.title': 'Experience',
    'experience.currentRole': 'Current Role',
    'experience.ml.date': 'January 2025 - Present',
    'experience.ml.title': 'Software Engineer',
    'experience.ml.location': 'Buenos Aires, Argentina',
    'experience.ml.desc1': 'Developed the \'Broadcast Channels\' platform, enabling Mercado Libre sellers to create Stories with AI-enhanced product images and send targeted communications with their followers.',
    'experience.ml.desc2': 'Applied SOLID principles, Clean Code methodologies, and asynchronous operations (Consumers, Jobs, Sinks) to build highly scalable systems.',
    'experience.ml.desc3': 'Cybersecurity specialist: Responsible for continuous vulnerability scanning and integrating secure development practices (S-SDLC).',
    'experience.ml.desc8': 'Led the migration of work repositories from Java 17 to Java 21, ensuring compatibility and leveraging the latest language features.',
    'experience.ml.desc4': 'Early adopter and promoter of generative AI tools such as Copilot, Cursor and Windsurf.',
    'experience.ml.desc5': 'NoSQL database storage and use of ElasticSearch as search engine.',
    'experience.ml.desc6': 'Observability and monitoring through Datadog, Kibana, Grafana and New Relic.',
    'experience.ml.desc7': 'Authored detailed technical documentation in Docsify, Swagger and AsyncAPI.',
    'experience.aivo.duration': '3 years 10 months',
    'experience.aivo.sr.title': 'SR Integration Developer',
    'experience.aivo.sr.date': 'March 2023 - January 2025 (1 year 11 months)',
    'experience.aivo.sr.location': 'Buenos Aires, Argentina',
    'experience.aivo.sr.desc1': 'Design and development of integrations between Aivo\'s virtual assistant and systems of banks, universities, telecommunications, and energy companies using Node.js/JavaScript, Laravel/PHP, and leveraging the OpenAI API.',
    'experience.aivo.sr.desc2': 'QA via Integration Tests, Code Reviews and SonarCloud.',
    'experience.aivo.sr.desc3': 'DB Management using MySQL and MongoDB.',
    'experience.aivo.sr.desc4': 'Responsible for production deployments and releases.',
    'experience.aivo.sr.desc5': 'Log Monitoring with AWS CloudWatch and Sentry.',
    'experience.aivo.sr.desc6': 'Functional analysis and information gathering to kickstart projects.',
    'experience.aivo.sr.desc7': 'Use of Docker and Jenkins (CI/CD) in development pipeline.',
    'experience.aivo.ssr.title': 'SSR Integration Developer',
    'experience.aivo.ssr.date': 'April 2021 - March 2023 (2 years)',
    'experience.aivo.ssr.location': 'Buenos Aires, Argentina',
    'experience.cloud.duration': '1 year 3 months',
    'experience.cloud.jr.title': 'JR Backend Developer',
    'experience.cloud.jr.date': 'July 2020 - April 2021 (10 months)',
    'experience.cloud.jr.location': 'Buenos Aires, Argentina',
    'experience.cloud.jr.desc1': 'Design and development of integrations and middlewares between external systems and Zoho applications.',
    'experience.cloud.jr.desc2': 'Data modeling and execution of large-scale processes (importing, synchronization, and updates).',
    'experience.cloud.jr.desc3': 'Functional and technical management of local and international projects, from planning to delivery.',
    'experience.cloud.jr.desc4': 'Facilitation of Agile practices, leading daily stand-ups and sprint retrospective meetings.',
    'experience.cloud.tc.title': 'Technical Consultant',
    'experience.cloud.tc.date': 'February 2020 - July 2020 (6 months)',
    'experience.cloud.tc.location': 'Buenos Aires, Argentina',
    'experience.cloud.tc.desc1': 'Surveying, designing, and automating processes through custom scripts for Zoho applications (CRM, Finances, Business Intelligence).',
    'experience.cloud.tc.desc2': 'Providing training to internal teams and clients on specific developments and applications.',
    'about.title': 'About Me',
    'about.greeting': 'Hello! I\'m Matías, a Software Engineer from Argentina 🇦🇷',
    'about.paragraph1': 'I specialize in Backend development and enjoy diving deep into artificial intelligence and cybersecurity, always staying current with emerging technologies and best practices.',
    'about.paragraph2': 'Currently, I work as a Software Engineer at <a href="https://investor.mercadolibre.com/" target="_blank" rel="noopener noreferrer">Mercado Libre</a>, where I focus on developing secure and scalable applications capable of handling millions of concurrent users. At the same time, I am completing my Bachelor\'s degree in Computer Science at <a href="https://www.21.edu.ar" target="_blank" rel="noopener noreferrer">Universidad Siglo 21</a>.',
    'stack.title': 'Technology Stack',
    'projects.title': 'My Projects',
    'projects.loading': 'Loading projects...',
    'cv.title': 'CV',
    'cv.description': 'View my resume as a PDF',
    'cv.button': 'View CV',
    'footer.rights': 'All rights reserved.'
  },
  es: {
    'nav.about': 'Sobre Mí',
    'nav.experience': 'Experiencia',
    'nav.stack': 'Tecnologías',
    'nav.projects': 'Proyectos',
    'nav.cv': 'CV',
    'hero.subtitle': 'Software Engineer',
    'hero.description': 'Creando soluciones escalables y explorando el potencial de las últimas tecnologías 🚀',
    'hero.cta': 'Sobre Mí',
    'experience.title': 'Experiencia',
    'experience.currentRole': 'Rol Actual',
    'experience.ml.date': 'Enero 2025 - Actualidad',
    'experience.ml.title': 'Ingeniero de Software',
    'experience.ml.location': 'Buenos Aires, Argentina',
    'experience.ml.desc1': 'Desarrollo de la plataforma \'Canales de difusión\', permitiendo a los vendedores de Mercado Libre crear Stories con imágenes de productos mejoradas por IA y enviar comunicaciones dirigidas a sus seguidores.',
    'experience.ml.desc2': 'Aplicación de principios SOLID, metodologías de Clean Code y operaciones asincrónicas (Consumers, Jobs, Sinks) para construir sistemas altamente escalables.',
    'experience.ml.desc3': 'Especialista en ciberseguridad: Responsable del escaneo continuo de vulnerabilidades e integración de prácticas de desarrollo seguro (S-SDLC).',
    'experience.ml.desc8': 'Migración de los repositorios de trabajo de Java 17 a Java 21, asegurando compatibilidad y aprovechando las últimas características del lenguaje.',
    'experience.ml.desc4': 'Early adopter y promotor de herramientas de IA generativa como Copilot, Cursor y Windsurf.',
    'experience.ml.desc5': 'Almacenamiento en bases de datos NoSQL y uso de ElasticSearch como motor de búsqueda.',
    'experience.ml.desc6': 'Observabilidad y monitoreo a través de Datadog, Kibana, Grafana y New Relic.',
    'experience.ml.desc7': 'Creación de documentación técnica detallada en Docsify, Swagger y AsyncAPI.',
    'experience.aivo.duration': '3 años 10 meses',
    'experience.aivo.sr.title': 'Desarrollador de Integraciones SR',
    'experience.aivo.sr.date': 'Marzo 2023 - Enero 2025 (1 año 11 meses)',
    'experience.aivo.sr.location': 'Buenos Aires, Argentina',
    'experience.aivo.sr.desc1': 'Diseño y desarrollo de integraciones entre el asistente virtual de Aivo y sistemas de bancos, universidades, telecomunicaciones y compañías de energía usando Node.js/JavaScript, Laravel/PHP, y aprovechando la API de OpenAI.',
    'experience.aivo.sr.desc2': 'QA mediante Integration Tests, Code Reviews y SonarCloud.',
    'experience.aivo.sr.desc3': 'Gestión de BD usando MySQL y MongoDB.',
    'experience.aivo.sr.desc4': 'Responsable de los despliegues y puestas en producción.',
    'experience.aivo.sr.desc5': 'Monitoreo de logs con AWS CloudWatch y Sentry.',
    'experience.aivo.sr.desc6': 'Análisis funcional y recopilación de información para iniciar proyectos.',
    'experience.aivo.sr.desc7': 'Uso de Docker y Jenkins (CI/CD) en pipeline de desarrollo.',
    'experience.aivo.ssr.title': 'Desarrollador de Integraciones SSR',
    'experience.aivo.ssr.date': 'Abril 2021 - Marzo 2023 (2 años)',
    'experience.aivo.ssr.location': 'Buenos Aires, Argentina',
    'experience.cloud.duration': '1 año 3 meses',
    'experience.cloud.jr.title': 'Desarrollador Backend JR',
    'experience.cloud.jr.date': 'Julio 2020 - Abril 2021 (10 meses)',
    'experience.cloud.jr.location': 'Buenos Aires, Argentina',
    'experience.cloud.jr.desc1': 'Diseño y desarrollo de integraciones y middlewares entre sistemas externos y aplicaciones de Zoho.',
    'experience.cloud.jr.desc2': 'Modelado de datos y ejecución de procesos a gran escala (importación, sincronización y actualizaciones).',
    'experience.cloud.jr.desc3': 'Gestión funcional y técnica de proyectos locales e internacionales, desde la planificación hasta la entrega.',
    'experience.cloud.jr.desc4': 'Facilitación de prácticas Ágiles, liderando stand-ups diarios y reuniones retrospectivas de sprint.',
    'experience.cloud.tc.title': 'Consultor Técnico',
    'experience.cloud.tc.date': 'Febrero 2020 - Julio 2020 (6 meses)',
    'experience.cloud.tc.location': 'Buenos Aires, Argentina',
    'experience.cloud.tc.desc1': 'Relevamiento, diseño y automatización de procesos mediante scripts personalizados para aplicaciones de Zoho (CRM, Finanzas, Business Intelligence).',
    'experience.cloud.tc.desc2': 'Capacitación a equipos internos y clientes sobre desarrollos específicos y aplicaciones.',
    'about.title': 'Sobre Mí',
    'about.greeting': 'Hola! Soy Matías, un Desarrollador de Software de Argentina 🇦🇷',
    'about.paragraph1': 'Me especializo en desarrollo Backend y disfruto profundizar en inteligencia artificial y ciberseguridad, manteniéndome siempre actualizado con las tecnologías emergentes y mejores prácticas.',
    'about.paragraph2': 'Actualmente trabajo como Software Engineer en <a href="https://investor.mercadolibre.com/" target="_blank" rel="noopener noreferrer">Mercado Libre</a>, donde me especializo en el desarrollo de aplicaciones seguras y escalables capaces de soportar millones de usuarios concurrentes. En simultáneo, estoy terminando de cursar la Licenciatura en Informática en la <a href="https://www.21.edu.ar" target="_blank" rel="noopener noreferrer">Universidad Siglo 21</a>.',
    'stack.title': 'Stack Tecnológico',
    'projects.title': 'Mis Proyectos',
    'projects.loading': 'Cargando proyectos...',
    'cv.title': 'CV',
    'cv.description': 'Ver mi currículum en PDF',
    'cv.button': 'Ver CV',
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
    cvDownload.href = lang === 'en' ? 'CV - Matías Carabella - EN.pdf' : 'CV - Matías Carabella - ES.pdf';
  }
}
