import { ParticleSystem } from './particles.js';
import { translations } from './translations.js';

// Constants
const CONFIG = {
  GITHUB_USERNAME: 'MatiasCarabella',
  CAROUSEL_GAP: 16,
  CAROUSEL_PADDING: 16,
  SWIPE_THRESHOLD: 20,
  SWIPE_VELOCITY: 0.2,
  SWIPE_MIN_DISTANCE: 50
};

// Initialize Particles
document.addEventListener('DOMContentLoaded', () => {
  try {
    new ParticleSystem('particles-canvas');
  } catch (error) {
    console.error('Failed to initialize particles:', error);
  }

  // Set current year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Initialize all features
  initTheme();
  initLanguage();
  initActiveNavigation();
  initHeroCTA();
  initMobileMenu();
  
  // Fetch Projects (async, non-blocking)
  fetchProjects().catch(error => {
    console.error('Failed to fetch projects:', error);
  });
});

// Theme Logic
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// GitHub Projects Logic
async function fetchProjects() {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;
  
  const apiUrl = `https://api.github.com/users/${CONFIG.GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

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
    
    // Generate dynamic filters based on available languages
    generateFilters(projects);
    
    // Initialize carousel for mobile
    initCarousel(projects);

  } catch (error) {
    console.error('Error fetching repos:', error);
    renderPlaceholders(projectsGrid);
  }
}

function generateFilters(projects) {
  const filtersContainer = document.querySelector('.projects-filters');
  if (!filtersContainer) return;

  // Count projects by language
  const languageCounts = {};
  projects.forEach(repo => {
    const lang = repo.language;
    if (lang) { // Only count projects with a language (exclude 'Other')
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
    }
  });

  // Sort languages by count (descending)
  const sortedLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang);

  // Get current language for translations
  const currentLang = document.documentElement.getAttribute('lang') || 'en';
  const allText = translations[currentLang]['projects.filter.all'] || 'All';

  // Generate filter buttons HTML
  const filtersHTML = [
    `<button class="filter-btn active" data-filter="all" data-i18n="projects.filter.all" aria-label="Show all projects">${allText}</button>`,
    ...sortedLanguages.map(lang => 
      `<button class="filter-btn" data-filter="${lang}" aria-label="Filter by ${lang}">${lang}</button>`
    )
  ].join('');

  filtersContainer.innerHTML = filtersHTML;
  
  // Re-initialize filter event listeners
  initProjectFilters();
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
  const language = repo.language || 'Other';
  const displayLanguage = language === 'Other' ? 'Code' : language;
  return `
    <div class="project-card" data-language="${language}">
      <h3 class="project-name">${repo.name}</h3>
      <p class="project-desc">${repo.description || ''}</p>
      <div class="project-meta">
        <div class="project-lang">
          <span class="lang-dot" style="background-color: ${langColor}"></span>
          <span>${displayLanguage}</span>
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

// Global carousel state
let carouselState = {
  currentIndex: 0
};

// Carousel Logic for Mobile
function initCarousel(projects) {
  const carouselTrack = document.getElementById('carousel-track');
  const carouselDots = document.getElementById('carousel-dots');
  
  if (!carouselTrack || !carouselDots) return;
  
  // Populate carousel with project cards
  carouselTrack.innerHTML = projects.map(repo => createProjectCard(repo)).join('');
  
  const cards = carouselTrack.querySelectorAll('.project-card');
  carouselState.currentIndex = 0;
  
  // Create dots
  carouselDots.innerHTML = projects.map((_, index) => 
    `<button class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Go to project ${index + 1}"></button>`
  ).join('');
  
  const dots = carouselDots.querySelectorAll('.carousel-dot');
  
  // Set initial state for all cards
  cards.forEach((card, i) => {
    if (i === 0) {
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
      card.style.cursor = 'default';
    } else {
      card.style.opacity = '0.5';
      card.style.transform = 'scale(0.95)';
      card.style.cursor = 'pointer';
    }
  });
  
  function updateCarousel(index) {
    carouselState.currentIndex = index;
    const visibleCards = Array.from(carouselTrack.querySelectorAll('.project-card:not(.hidden)'));
    if (visibleCards.length === 0) return;
    
    const cardWidth = visibleCards[0].offsetWidth;
    const offset = -(index * (cardWidth + CONFIG.CAROUSEL_GAP)) + CONFIG.CAROUSEL_PADDING;
    carouselTrack.style.transform = `translateX(${offset}px)`;
    
    // Update dots
    const currentDots = carouselDots.querySelectorAll('.carousel-dot');
    currentDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    
    // Update cursor style and visual state for visible cards only
    visibleCards.forEach((card, i) => {
      card.style.cursor = i === index ? 'default' : 'pointer';
      
      // Reset all cards first
      card.style.opacity = '0.5';
      card.style.transform = 'scale(0.95)';
      
      // Highlight the focused card
      if (i === index) {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      }
    });
  }
  
  // Dot navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      updateCarousel(parseInt(dot.getAttribute('data-index')));
    });
  });
  
  // Click to advance (tap on card)
  cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      // Don't advance if clicking on a link
      if (e.target.closest('a')) return;
      
      // Check if card is hidden
      if (card.classList.contains('hidden')) return;
      
      // Find the visual index among visible cards
      const visibleCards = Array.from(carouselTrack.querySelectorAll('.project-card:not(.hidden)'));
      const visualIndex = visibleCards.indexOf(card);
      
      // Only advance if clicking on a non-focused card (side cards)
      if (visualIndex !== -1 && visualIndex !== carouselState.currentIndex) {
        updateCarousel(visualIndex);
      }
    });
  });
  
  // Touch/swipe support
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let isDragging = false;
  let startTime = 0;
  let touchedCard = null;
  
  carouselTrack.addEventListener('touchstart', (e) => {
    // Check if touch started on a card
    touchedCard = e.target.closest('.project-card');
    if (!touchedCard) {
      isDragging = false;
      return;
    }
    
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = Date.now();
    isDragging = true;
  });
  
  carouselTrack.addEventListener('touchmove', (e) => {
    if (!isDragging || !touchedCard) return;
    currentX = e.touches[0].clientX;
    currentY = e.touches[0].clientY;
    
    // Prevent vertical scroll if horizontal swipe is detected
    const diffX = Math.abs(currentX - startX);
    const diffY = Math.abs(currentY - startY);
    
    if (diffX > diffY && diffX > 10) {
      e.preventDefault();
    }
  }, { passive: false });
  
  carouselTrack.addEventListener('touchend', () => {
    if (!isDragging || !touchedCard) {
      touchedCard = null;
      isDragging = false;
      return;
    }
    
    isDragging = false;
    
    const diffX = startX - currentX;
    const diffY = Math.abs(startY - currentY);
    const timeDiff = Date.now() - startTime;
    
    // Get visible cards count
    const visibleCards = carouselTrack.querySelectorAll('.project-card:not(.hidden)');
    const maxIndex = visibleCards.length - 1;
    
    // Only trigger swipe if horizontal movement is greater than vertical
    // and movement is significant enough
    if (Math.abs(diffX) > diffY && Math.abs(diffX) > CONFIG.SWIPE_THRESHOLD) {
      // Fast swipe (velocity-based)
      const velocity = Math.abs(diffX) / timeDiff;
      
      if (velocity > CONFIG.SWIPE_VELOCITY || Math.abs(diffX) > CONFIG.SWIPE_MIN_DISTANCE) {
        if (diffX > 0 && carouselState.currentIndex < maxIndex) {
          updateCarousel(carouselState.currentIndex + 1);
        } else if (diffX < 0 && carouselState.currentIndex > 0) {
          updateCarousel(carouselState.currentIndex - 1);
        }
      }
    }
    
    touchedCard = null;
  });
}

// Project Filters Logic
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter projects in grid
      const projectCards = document.querySelectorAll('#projects-grid .project-card');
      projectCards.forEach(card => {
        const language = card.getAttribute('data-language');
        
        if (filter === 'all' || language === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
      
      // Update carousel for mobile
      updateCarouselFilter(filter);
    });
  });
}

function updateCarouselFilter(filter) {
  const carouselTrack = document.getElementById('carousel-track');
  const carouselDots = document.getElementById('carousel-dots');
  
  if (!carouselTrack || !carouselDots) return;
  
  const allCards = carouselTrack.querySelectorAll('.project-card');
  const visibleCards = [];
  
  // Show/hide cards based on filter
  allCards.forEach(card => {
    const language = card.getAttribute('data-language');
    if (filter === 'all' || language === filter) {
      card.classList.remove('hidden');
      visibleCards.push(card);
    } else {
      card.classList.add('hidden');
    }
  });
  
  // Update dots to match visible cards
  carouselDots.innerHTML = visibleCards.map((_, index) => 
    `<button class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Go to project ${index + 1}"></button>`
  ).join('');
  
  // Reset carousel state to first visible card
  carouselState.currentIndex = 0;
  
  // Reset to first card and set visual states
  carouselTrack.style.transform = `translateX(${CONFIG.CAROUSEL_PADDING}px)`;
  
  // Set visual state for all visible cards
  visibleCards.forEach((card, i) => {
    if (i === 0) {
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
      card.style.cursor = 'default';
    } else {
      card.style.opacity = '0.5';
      card.style.transform = 'scale(0.95)';
      card.style.cursor = 'pointer';
    }
  });
  
  // Re-attach dot listeners using the shared updateCarousel function from initCarousel
  const dots = carouselDots.querySelectorAll('.carousel-dot');
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'), 10);
      carouselState.currentIndex = index;
      
      const currentVisibleCards = Array.from(carouselTrack.querySelectorAll('.project-card:not(.hidden)'));
      if (currentVisibleCards.length === 0) return;
      
      const cardWidth = currentVisibleCards[0].offsetWidth;
      const offset = -(index * (cardWidth + CONFIG.CAROUSEL_GAP)) + CONFIG.CAROUSEL_PADDING;
      carouselTrack.style.transform = `translateX(${offset}px)`;
      
      // Update visual states
      currentVisibleCards.forEach((card, i) => {
        if (i === index) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.cursor = 'default';
        } else {
          card.style.opacity = '0.5';
          card.style.transform = 'scale(0.95)';
          card.style.cursor = 'pointer';
        }
      });
      
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
    });
  });
}

// Mobile Menu Logic
function initMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const menuClose = document.getElementById('mobile-menu-close');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');
  
  if (!menuToggle || !menu || !overlay || !menuClose) return;
  
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
  
  function openMenu() {
    menu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMenu() {
    menu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  
  // Close menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

// Active Navigation Logic
function initActiveNavigation() {
  const sections = document.querySelectorAll('section[id], main[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const logo = document.querySelector('.logo');
  const heroSection = document.querySelector('.hero');

  function updateActiveNav() {
    let current = '';
    const scrollY = window.scrollY || window.pageYOffset;

    // Check if we're in the hero section (top of page)
    if (heroSection && scrollY < heroSection.offsetHeight - 200) {
      // Highlight logo when in hero section
      if (logo) {
        logo.classList.add('active');
      }
      // Remove active from all nav links
      navLinks.forEach(link => {
        link.classList.remove('active');
      });
    } else {
      // Remove active from logo when not in hero
      if (logo) {
        logo.classList.remove('active');
      }

      // Standard section detection
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
  
  // Update filter "All" button text
  const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
  if (allFilterBtn) {
    allFilterBtn.textContent = translations[lang]['projects.filter.all'] || 'All';
  }
}
