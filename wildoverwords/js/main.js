/* ========================================
   Wild Over Words — main.js
   Modern Organic Editorial Theme
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;
  if (isMobileViewport) {
    document.body.classList.add('mobile-optimized');
  }

  // --- Page Loader ---
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('loaded'), 400);
    });
    // Fallback — hide after 3s regardless
    setTimeout(() => loader.classList.add('loaded'), 3000);
  }

  // --- Custom Cursor ---
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  if (cursorDot && cursorOutline && window.matchMedia('(hover: hover) and (min-width: 769px)').matches) {
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    // Smooth trailing outline
    function animateOutline() {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      cursorOutline.style.left = outlineX + 'px';
      cursorOutline.style.top = outlineY + 'px';
      requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Hover effects
    const hoverEls = document.querySelectorAll('a, button, [role="button"], .reel-card, .service-card, .blog-card, .portfolio-item');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('cursor-hover');
        cursorOutline.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('cursor-hover');
        cursorOutline.classList.remove('cursor-hover');
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorOutline.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';
    });
  }

  // --- Scroll Progress Bar ---
  const scrollProgress = document.querySelector('.scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    }, { passive: true });
  }

  // --- Navbar scroll effect ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // --- Mobile hamburger menu ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll animations (Intersection Observer) with stagger ---
  const animatedEls = document.querySelectorAll('.fade-up, .fade-in, .scale-in');
  if (animatedEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const parent = entry.target.parentElement;
          if (parent) {
            const siblings = Array.from(parent.children).filter(el =>
              el.classList.contains('fade-up') || el.classList.contains('fade-in') || el.classList.contains('scale-in')
            );
            const index = siblings.indexOf(entry.target);
            if (index > 0) {
              entry.target.style.transitionDelay = `${index * 0.08}s`;
            }
          }
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    animatedEls.forEach(el => observer.observe(el));
  } else {
    animatedEls.forEach(el => el.classList.add('visible'));
  }

  // --- Image reveal animations ---
  const revealImages = document.querySelectorAll('.reveal-image');
  if (isMobileViewport) {
    revealImages.forEach(el => el.classList.add('revealed'));
  } else if (revealImages.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealImages.forEach(el => revealObserver.observe(el));
  } else {
    revealImages.forEach(el => el.classList.add('revealed'));
  }

  // --- Animated number counters ---
  const resultValues = document.querySelectorAll('.result-value');
  if (resultValues.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    resultValues.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const raw = el.textContent.trim();
    const match = raw.match(/^([\d,.]+)(.*)/);
    if (!match) return;

    const numberStr = match[1].replace(/,/g, '');
    const suffix = match[2];
    const target = parseFloat(numberStr);
    const hasDecimal = numberStr.includes('.');
    const decimalPlaces = hasDecimal ? (numberStr.split('.')[1] || '').length : 0;
    const hasComma = match[1].includes(',');

    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      let display;
      if (hasDecimal) {
        display = current.toFixed(decimalPlaces);
      } else if (hasComma) {
        display = Math.round(current).toLocaleString();
      } else {
        display = Math.round(current).toString();
      }

      el.textContent = display + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    el.textContent = '0' + suffix;
    requestAnimationFrame(tick);
  }

  // --- Active nav link highlight on scroll ---
  const sections = document.querySelectorAll('section[id]');
  if (sections.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY + 120;
      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href*="${id}"]`);
        if (link) {
          link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
      });
    }, { passive: true });
  }

  // --- Hero parallax effect ---
  const heroImage = document.querySelector('.hero-image-container img');
  if (heroImage && !isMobileViewport) {
    window.addEventListener('scroll', () => {
      const rect = heroImage.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const yPos = -(rect.top * 0.15);
        heroImage.style.transform = `translateY(${yPos}px)`;
      }
    }, { passive: true });
  }

  // --- Smooth reveal for case study sections ---
  const caseStudies = document.querySelectorAll('.case-study');
  if (caseStudies.length && 'IntersectionObserver' in window) {
    const csObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          csObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -80px 0px' });

    caseStudies.forEach(cs => {
      cs.style.opacity = '0';
      cs.style.transform = 'translateY(24px)';
      cs.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      csObserver.observe(cs);
    });
  }

  // --- Mobile: collapse long case study details for better scanability ---
  if (isMobileViewport && caseStudies.length) {
    caseStudies.forEach((study) => {
      const children = Array.from(study.children);
      const firstDetailIndex = children.findIndex((el) => el.tagName === 'H4');
      if (firstDetailIndex === -1) return;

      const detailsWrap = document.createElement('div');
      detailsWrap.className = 'cs-mobile-details';

      children.slice(firstDetailIndex).forEach((node) => {
        detailsWrap.appendChild(node);
      });

      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'cs-mobile-toggle';
      toggleBtn.textContent = 'Read Full Case Study';
      toggleBtn.setAttribute('aria-expanded', 'false');

      study.appendChild(detailsWrap);
      study.appendChild(toggleBtn);

      toggleBtn.addEventListener('click', () => {
        const expanded = study.classList.toggle('expanded');
        toggleBtn.setAttribute('aria-expanded', String(expanded));
        toggleBtn.textContent = expanded ? 'Show Less' : 'Read Full Case Study';
      });
    });
  }

  // --- Back to top button ---
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Magnetic hover on CTA buttons ---
  const magneticBtns = document.querySelectorAll('.btn-large, .nav-cta');
  if (!isMobileViewport && window.matchMedia('(hover: hover)').matches) {
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // --- Form submission feedback ---
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          btn.textContent = 'Sent!';
          form.reset();
          setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 3000);
        } else {
          btn.textContent = 'Error — try again';
          btn.disabled = false;
          setTimeout(() => { btn.textContent = originalText; }, 3000);
        }
      } catch {
        btn.textContent = 'Error — try again';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = originalText; }, 3000);
      }
    });
  }

});
