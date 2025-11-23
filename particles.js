export class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    
    this.resize();
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });
    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
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
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(this.mouse);
      this.particles[i].draw(this.ctx);
    }
    this.connect();
  }

  connect() {
    let opacityValue = 1;
    for (let a = 0; a < this.particles.length; a++) {
      for (let b = a; b < this.particles.length; b++) {
        const distance = ((this.particles[a].x - this.particles[b].x) * (this.particles[a].x - this.particles[b].x)) +
                         ((this.particles[a].y - this.particles[b].y) * (this.particles[a].y - this.particles[b].y));
        
        if (distance < (this.canvas.width/7) * (this.canvas.height/7)) {
          opacityValue = 1 - (distance / 20000);
          
          // Get current theme color for lines
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          const color = isDark ? '255, 255, 255' : '59, 130, 246'; // White or Primary Blue
          
          this.ctx.strokeStyle = `rgba(${color}, ${opacityValue * 0.2})`; // Lower opacity for subtle lines
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
    const color = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(59, 130, 246, 0.8)';
    
    ctx.fillStyle = color;
    ctx.fill();
  }

  update(mouse) {
    // Check if particle is still within canvas
    if (this.x > this.canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > this.canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // Check collision detection - mouse position / particle position
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx*dx + dy*dy);
    
    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < this.canvas.width - this.size * 10) {
        this.x += 3;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 3;
      }
      if (mouse.y < this.y && this.y < this.canvas.height - this.size * 10) {
        this.y += 3;
      }
      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 3;
      }
    }
    
    // Move particle
    this.x += this.directionX * 0.4; // Speed factor
    this.y += this.directionY * 0.4;
  }
}
