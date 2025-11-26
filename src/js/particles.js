export class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 125, lastMoveTime: 0 };
    this.animationId = null;
    
    // Debounce resize for better performance
    this.resizeTimeout = null;

    this.resize();
    this.init();
    this.animate();

    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.resize(), 150);
    });
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
      this.mouse.lastMoveTime = Date.now();
    });
    
    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    clearTimeout(this.resizeTimeout);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.init(); // Re-init particles on resize to maintain density
  }

  init() {
    this.particles = [];
    // Density based on screen size
    const numberOfParticles = (this.canvas.width * this.canvas.height) / 9000;

    for (let i = 0; i < numberOfParticles; i++) {
      const size = (Math.random() * 3) + 1;
      const x = (Math.random() * ((this.canvas.width - size * 2) - (size * 2)) + size * 2);
      const y = (Math.random() * ((this.canvas.height - size * 2) - (size * 2)) + size * 2);
      const directionX = (Math.random() * 2) - 1; // -1 to 1
      const directionY = (Math.random() * 2) - 1;

      this.particles.push(new Particle(this.canvas, x, y, directionX, directionY, size));
    }
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Use for-of for better readability
    for (const particle of this.particles) {
      particle.update(this.mouse);
      particle.draw(this.ctx);
    }
    this.connect();
  }

  connect() {
    const maxDistance = (this.canvas.width / 7) * (this.canvas.height / 7);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const color = isDark ? '168, 85, 247' : '59, 130, 246';
    
    for (let a = 0; a < this.particles.length; a++) {
      for (let b = a + 1; b < this.particles.length; b++) {
        const dx = this.particles[a].x - this.particles[b].x;
        const dy = this.particles[a].y - this.particles[b].y;
        const distance = dx * dx + dy * dy;

        if (distance < maxDistance) {
          const opacityValue = 1 - (distance / 20000);
          this.ctx.strokeStyle = `rgba(${color}, ${opacityValue * 0.05})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
          this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
          this.ctx.stroke();
        }
      }
    }
  }
}

class Particle {
  constructor(canvas, x, y, directionX, directionY, size) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);

    // Get current theme color for dots
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const color = isDark ? 'rgba(168, 85, 247, 0.4)' : 'rgba(59, 130, 246, 0.4)';

    ctx.fillStyle = color;
    ctx.fill();
  }

  update(mouse) {
    // Bounce off edges
    if (this.x > this.canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > this.canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // Mouse interaction
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const isMoving = (Date.now() - mouse.lastMoveTime) < 100;

      if (isMoving && distance < mouse.radius + this.size) {
        const repelForce = 3;
        const minBoundary = this.size * 10;
        const maxBoundaryX = this.canvas.width - minBoundary;
        const maxBoundaryY = this.canvas.height - minBoundary;
        
        if (mouse.x < this.x && this.x < maxBoundaryX) this.x += repelForce;
        if (mouse.x > this.x && this.x > minBoundary) this.x -= repelForce;
        if (mouse.y < this.y && this.y < maxBoundaryY) this.y += repelForce;
        if (mouse.y > this.y && this.y > minBoundary) this.y -= repelForce;
      }
    }

    // Move particle
    this.x += this.directionX * 0.2;
    this.y += this.directionY * 0.2;
  }
}
