/* ===== ANIMATIONS.JS - Scroll & GSAP-style animations ===== */

(function () {
  'use strict';

  // ===== Particle Background for Hero & Other Sections =====
  class ParticleNetwork {
    constructor(container, colorPrefix = 'rgba(56, 189, 248,') {
      this.container = container;
      if (!this.container) return;
      
      this.colorPrefix = colorPrefix;
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.mouse = { x: null, y: null, radius: 150 };
      this.animationId = null;

      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.zIndex = '0';
      this.container.appendChild(this.canvas);
      
      this.resize();
      this.createParticles();
      this.animate();

      window.addEventListener('resize', () => this.resize());
      this.container.addEventListener('mousemove', (e) => {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });
      this.container.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }

    resize() {
      this.canvas.width = this.container.offsetWidth;
      this.canvas.height = this.container.offsetHeight;
    }

    createParticles() {
      const count = Math.floor((this.canvas.width * this.canvas.height) / 12000);
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: (Math.random() - 0.5) * 0.8,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach((p, i) => {
        // Move
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < 0) p.x = this.canvas.width;
        if (p.x > this.canvas.width) p.x = 0;
        if (p.y < 0) p.y = this.canvas.height;
        if (p.y > this.canvas.height) p.y = 0;

        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `${this.colorPrefix} ${p.opacity})`;
        this.ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `${this.colorPrefix} ${0.15 * (1 - dist / 120)})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }

        // Mouse interaction
        if (this.mouse.x !== null) {
          const dx = p.x - this.mouse.x;
          const dy = p.y - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < this.mouse.radius) {
            const force = (this.mouse.radius - dist) / this.mouse.radius;
            p.x += (dx / dist) * force * 2;
            p.y += (dy / dist) * force * 2;
          }
        }
      });

      this.animationId = requestAnimationFrame(() => this.animate());
    }
  }

  // ===== Scroll Reveal Observer =====
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Stagger children animation
            const children = entry.target.querySelectorAll('.skill-item, .stat-card, .research-area, .timeline-node, .about-panel, .stat-card-enhanced');
            children.forEach((child, i) => {
              child.style.transitionDelay = `${i * 0.1}s`;
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // ===== Terminal Boot Sequence Animation =====
  function initTerminalTyping() {
    const terminal = document.getElementById('aboutTerminal');
    const bootContainer = document.getElementById('bootSequence');
    const mainContent = document.getElementById('termMainContent');
    if (!terminal || !bootContainer || !mainContent) return;

    const bootLines = [
      "Initializing AI Command Center...",
      "Loading core modules... [OK]",
      "Establishing secure connection... [OK]",
      "Access granted. Welcome, Ahwaz."
    ];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          let lineIndex = 0;
          let charIndex = 0;
          
          const typeNextChar = () => {
            if (lineIndex < bootLines.length) {
              const currentLine = bootLines[lineIndex];
              if (charIndex === 0) {
                const p = document.createElement('div');
                p.className = 'term-cmd';
                bootContainer.appendChild(p);
              }
              const p = bootContainer.lastChild;
              p.textContent += currentLine.charAt(charIndex);
              charIndex++;

              if (charIndex >= currentLine.length) {
                lineIndex++;
                charIndex = 0;
                setTimeout(typeNextChar, 300); // pause between lines
              } else {
                setTimeout(typeNextChar, 20); // typing speed
              }
            } else {
              // Boot sequence finished
              setTimeout(() => {
                bootContainer.style.display = 'none';
                mainContent.style.display = 'block';
                
                // Trigger reflow for opacity transition
                void mainContent.offsetWidth;
                mainContent.style.opacity = '1';

                // Animate progress bars
                const progressBars = mainContent.querySelectorAll('.term-prog-bar');
                progressBars.forEach(bar => {
                  const target = parseInt(bar.getAttribute('data-progress')) || 10;
                  let currentStr = "";
                  let currentCount = 0;
                  const maxChars = 10;
                  
                  const fillBar = setInterval(() => {
                    if (currentCount < target) {
                      currentStr += "█";
                    } else if (currentCount < maxChars) {
                      currentStr += "░";
                    }
                    bar.textContent = currentStr;
                    currentCount++;
                    if (currentCount >= maxChars) clearInterval(fillBar);
                  }, 50);
                });
              }, 500);
            }
          };
          
          typeNextChar();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(terminal);
  }

  // ===== Skills Globe Canvas (3D Math in 2D) =====
  function initSkillsGlobe() {
    const canvas = document.getElementById('skillsGlobeCanvas');
    const container = document.getElementById('globeContainer');
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Nodes for the globe wireframe
    const nodes = [];
    const numNodes = 150;
    const globeRadius = 220;
    
    let rotationX = 0;
    let rotationY = 0;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let autoRotateSpeed = 0.002;
    
    // Initialize nodes on a sphere
    for (let i = 0; i < numNodes; i++) {
      const phi = Math.acos(-1 + (2 * i) / numNodes);
      const theta = Math.sqrt(numNodes * Math.PI) * phi;
      nodes.push({
        x: globeRadius * Math.cos(theta) * Math.sin(phi),
        y: globeRadius * Math.sin(theta) * Math.sin(phi),
        z: globeRadius * Math.cos(phi)
      });
    }
    
    function resize() {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    // Interaction
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });
    
    window.addEventListener('mouseup', () => isDragging = false);
    
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      rotationY += dx * 0.005;
      rotationX += dy * 0.005;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });
    
    // Orbit Icons integration
    const orbitIcons = document.querySelectorAll('.orbit-icon');
    const iconData = [];
    orbitIcons.forEach((icon, i) => {
      // distribute icons
      const phi = Math.acos(-1 + (2 * i) / orbitIcons.length);
      const theta = Math.sqrt(orbitIcons.length * Math.PI) * phi;
      const r = globeRadius + 60; // Orbit slightly outside globe
      iconData.push({
        el: icon,
        x: r * Math.cos(theta) * Math.sin(phi),
        y: r * Math.sin(theta) * Math.sin(phi),
        z: r * Math.cos(phi),
        baseX: r * Math.cos(theta) * Math.sin(phi),
        baseY: r * Math.sin(theta) * Math.sin(phi),
        baseZ: r * Math.cos(phi)
      });
      
      // Tooltip logic
      icon.addEventListener('mouseenter', (e) => {
        const tooltip = document.getElementById('skillTooltip');
        tooltip.querySelector('.tooltip-name').textContent = icon.getAttribute('data-skill');
        tooltip.querySelector('.tooltip-category').textContent = icon.getAttribute('data-category');
        tooltip.querySelector('.tooltip-level').textContent = icon.getAttribute('data-level');
        tooltip.querySelector('.tooltip-desc').textContent = icon.getAttribute('data-desc');
        
        // Position tooltip relative to viewport/container
        const rect = icon.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2 - 130) + 'px';
        tooltip.style.top = (rect.top - 140 + window.scrollY) + 'px'; 
        tooltip.classList.add('visible');
        icon.classList.add('hovered');
      });
      
      icon.addEventListener('mouseleave', () => {
        document.getElementById('skillTooltip').classList.remove('visible');
        icon.classList.remove('hovered');
      });
    });
    
    function animate() {
      ctx.clearRect(0, 0, width, height);
      if (!isDragging) {
        rotationY -= autoRotateSpeed;
      }
      
      const cx = width / 2;
      const cy = height / 2;
      
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      
      const projectedNodes = [];
      
      // Rotate and project globe nodes
      nodes.forEach(node => {
        // Rotate Y
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.z * cosY + node.x * sinY;
        // Rotate X
        let y2 = node.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.y * sinX;
        
        const scale = 400 / (400 - z2);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;
        projectedNodes.push({ x: px, y: py, z: z2 });
      });
      
      // Draw neural network connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedNodes.length; i++) {
        const p1 = projectedNodes[i];
        if (p1.z < -100) continue; // Behind globe, hide mostly
        
        const opacity = Math.min(1, Math.max(0.1, (p1.z + globeRadius) / (globeRadius * 2)));
        ctx.fillStyle = `rgba(56, 189, 248, ${opacity})`;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 2 * opacity, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect close nodes
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const p2 = projectedNodes[j];
          if (p2.z < -100) continue;
          
          const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
          if (dist < 40) {
            ctx.strokeStyle = `rgba(34, 197, 94, ${opacity * 0.3})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      
      // Rotate and position HTML icons
      iconData.forEach(item => {
        let x1 = item.baseX * cosY - item.baseZ * sinY;
        let z1 = item.baseZ * cosY + item.baseX * sinY;
        let y2 = item.baseY * cosX - z1 * sinX;
        let z2 = z1 * cosX + item.baseY * sinX;
        
        const scale = 400 / (400 - z2);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;
        
        // Update DOM
        if (z2 < -50) {
          item.el.style.opacity = '0';
          item.el.style.pointerEvents = 'none';
        } else {
          const depthScale = Math.max(0.4, Math.min(1.2, scale));
          const opacity = Math.min(1, (z2 + globeRadius + 50) / globeRadius);
          item.el.style.opacity = opacity.toString();
          item.el.style.pointerEvents = 'auto';
          item.el.style.left = px + 'px';
          item.el.style.top = py + 'px';
          item.el.style.transform = `translate(-50%, -50%) scale(${depthScale})`;
        }
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }

  // ===== Counter Animation =====
  function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number, .metric-num');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((num) => observer.observe(num));
  }

  function animateCounter(el, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;

    function step() {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        return;
      }
      el.textContent = Math.floor(current);
      requestAnimationFrame(step);
    }
    step();
  }

  // ===== Hero Element Stagger Animation =====
  function initHeroAnimation() {
    const elements = [
      '.hero-text .greeting',
      '.hero-text h1',
      '.hero-text .role',
      '.hero-text .description',
      '.hero-buttons',
      '.hero-social',
    ];

    elements.forEach((selector, i) => {
      const el = document.querySelector(selector);
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;

        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 100);
      }
    });

    // Hero visual scale-in
    const visual = document.querySelector('.hero-visual');
    if (visual) {
      visual.style.opacity = '0';
      visual.style.transform = 'scale(0.8)';
      visual.style.transition = 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s';
      setTimeout(() => {
        visual.style.opacity = '1';
        visual.style.transform = 'scale(1)';
      }, 100);
    }
  }

  // ===== Parallax effect on hero orbs =====
  function initParallax() {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      const orbs = document.querySelectorAll('.hero-orb');
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 15;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }

  // ===== Tilt effect on glass cards =====
  function initTiltEffect() {
    const cards = document.querySelectorAll('.glass-card, .about-photo-frame');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ===== Blog Category Filtering =====
  function initBlogFilter() {
    const filterBtns = document.querySelectorAll('.blog-cat-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-blog-filter');

        blogCards.forEach(card => {
          if (filterValue === 'all') {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 50);
          } else {
            const categories = card.getAttribute('data-blog-category').split(' ');
            if (categories.includes(filterValue)) {
              card.style.display = 'block';
              setTimeout(() => card.style.opacity = '1', 50);
            } else {
              card.style.opacity = '0';
              setTimeout(() => card.style.display = 'none', 300);
            }
          }
        });
      });
    });
  }

  // ===== Contact Form Quick Options =====
  function initContactForm() {
    const quickOptions = document.querySelectorAll('.quick-option');
    const subjectInput = document.getElementById('contactSubject');

    quickOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remove selected class from all
        quickOptions.forEach(opt => opt.classList.remove('selected'));
        // Add to clicked
        option.classList.add('selected');
        // Update input
        if (subjectInput) {
          subjectInput.value = option.getAttribute('data-value');
        }
      });
    });
  }

  // ===== Initialize all animations =====
  function init() {
    // Background Particles
    const heroSection = document.querySelector('.hero-bg');
    if (heroSection) new ParticleNetwork(heroSection, 'rgba(56, 189, 248,');
    
    const skillsSection = document.getElementById('skillsParticles');
    if (skillsSection) new ParticleNetwork(skillsSection, 'rgba(34, 197, 94,');
    
    const timelineSection = document.getElementById('timelineParticles');
    if (timelineSection) new ParticleNetwork(timelineSection, 'rgba(56, 189, 248,');

    initHeroAnimation();
    initScrollReveal();
    initTerminalTyping();
    initSkillsGlobe();
    initCounters();
    initParallax();
    initTiltEffect();
    initBlogFilter();
    initContactForm();
  }

  // Run on DOM loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
