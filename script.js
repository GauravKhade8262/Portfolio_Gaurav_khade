document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // PARTICLE BACKGROUND SYSTEM
  // ==========================================================================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 25000));

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? 'rgba(100, 255, 218, 0.3)' : 'rgba(0, 180, 216, 0.2)';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update();
      p1.draw();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(100, 255, 218, ${0.1 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // ==========================================================================
  // TYPEWRITER EFFECT
  // ==========================================================================
  const typewriterElement = document.getElementById('typewriter');
  const words = [
    'Junior Java Developer',
    'Spring Boot Architect',
    'Microservices Specialist',
    'Cloud-Native Engineer'
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1000);

  // ==========================================================================
  // MOBILE NAVIGATION & SCROLL ACTIVE
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinksList = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksList.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksList.classList.remove('open');
    });
  });

  // Scroll Actions
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Navbar style on scroll
    if (scrollPos > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    const backToTopBtn = document.getElementById('back-to-top');
    if (scrollPos > 500) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }

    // Active Section Link Highlight
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Back to top click handler
  document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ==========================================================================
  // SCROLL REVEAL & TRIGGER ANIMATIONS
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');
  const skillFills = document.querySelectorAll('.skill-fill');
  const statNumbers = document.querySelectorAll('.stat-num');
  let statsAnimated = false;
  let skillsAnimated = false;

  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;

    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < triggerBottom) {
        element.classList.add('active');
      }
    });

    // Trigger skills animation
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      const skillsTop = skillsSection.getBoundingClientRect().top;
      if (skillsTop < triggerBottom && !skillsAnimated) {
        skillFills.forEach(fill => {
          const width = fill.getAttribute('data-width');
          fill.style.width = `${width}%`;
        });
        skillsAnimated = true;
      }
    }

    // Trigger stat counters
    const homeSection = document.getElementById('home');
    if (homeSection) {
      const homeBottom = homeSection.getBoundingClientRect().bottom;
      if (homeBottom > 0 && !statsAnimated) {
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'));
          const duration = 2000;
          const stepTime = Math.abs(Math.floor(duration / target));
          let current = 0;
          
          const timer = setInterval(() => {
            current += 1;
            stat.textContent = current;
            if (current >= target) {
              stat.textContent = target;
              clearInterval(timer);
            }
          }, stepTime);
        });
        statsAnimated = true;
      }
    }
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial run on load

  // ==========================================================================
  // CONTACT FORM VALIDATION & SIMULATION
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple validation status tracking
    let isValid = true;
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#ff5f56';
      } else {
        input.style.borderColor = '';
      }
    });

    if (isValid) {
      const submitBtn = document.getElementById('send-message-btn');
      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span>';

      // Simulate network request
      setTimeout(() => {
        submitBtn.innerHTML = '<span>Sent!</span>';
        formSuccess.style.display = 'block';
        contactForm.reset();
        
        setTimeout(() => {
          formSuccess.style.display = 'none';
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
        }, 5000);
      }, 1500);
    }
  });

});
