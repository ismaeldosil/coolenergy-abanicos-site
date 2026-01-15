/**
 * Cool Energy Abanicos - Main JavaScript
 * Animaciones avanzadas inspiradas en tesoroxp.com
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // =====================================
  // Text Reveal Animation (character by character)
  // =====================================
  const textRevealElements = document.querySelectorAll('[data-text-reveal]');

  textRevealElements.forEach(element => {
    // Split text into characters, preserving HTML tags
    const html = element.innerHTML;

    // Simple split - just wrap visible characters
    let result = '';
    let inTag = false;

    for (let i = 0; i < html.length; i++) {
      const char = html[i];
      if (char === '<') inTag = true;
      if (inTag) {
        result += char;
        if (char === '>') inTag = false;
      } else if (char === ' ' || char === '\n') {
        result += char;
      } else {
        result += `<span class="char">${char}</span>`;
      }
    }

    element.innerHTML = result;

    // Animate with GSAP
    const chars = element.querySelectorAll('.char');

    // Set visible first
    gsap.set(chars, { opacity: 1, y: 0 });

    // Then animate
    gsap.from(chars, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: "expo.out",
      stagger: 0.015,
      delay: 0.3
    });
  });

  // =====================================
  // Parallax Effects
  // =====================================
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  parallaxElements.forEach(element => {
    const speed = element.dataset.parallaxSpeed || 0.2;

    gsap.to(element, {
      y: () => window.innerHeight * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  // =====================================
  // Staggered Grid Animations
  // =====================================
  const animateGrids = [
    '.categories-grid .category-card',
    '.gallery-grid .product-card',
    '.about-features .feature'
  ];

  animateGrids.forEach(selector => {
    const items = document.querySelectorAll(selector);
    if (items.length === 0) return;

    // Set initial state
    gsap.set(items, { opacity: 1, y: 0, scale: 1 });

    // Animate on scroll
    gsap.from(items, {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 0.6,
      ease: "expo.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: items[0].parentElement,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });

  // =====================================
  // Section Headers Animation
  // =====================================
  const sectionHeaders = document.querySelectorAll('.section-header');

  sectionHeaders.forEach(header => {
    const tag = header.querySelector('.section-tag');
    const title = header.querySelector('.section-title');
    const subtitle = header.querySelector('.section-subtitle');

    // Ensure visible by default
    gsap.set([tag, title, subtitle].filter(Boolean), { opacity: 1, y: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: "top 90%",
        toggleActions: "play none none none"
      }
    });

    if (tag) {
      tl.from(tag, { opacity: 0, y: 15, duration: 0.4, ease: "expo.out" });
    }

    if (title) {
      tl.from(title, { opacity: 0, y: 20, duration: 0.5, ease: "expo.out" }, "-=0.2");
    }

    if (subtitle) {
      tl.from(subtitle, { opacity: 0, y: 15, duration: 0.4, ease: "expo.out" }, "-=0.2");
    }
  });

  // =====================================
  // Hero Animation
  // =====================================
  const heroContent = document.querySelector('.hero-content');
  const heroBadge = document.querySelector('.hero-badge');
  const heroTagline = document.querySelector('.hero-tagline');
  const heroCta = document.querySelector('.hero-cta');

  if (heroContent) {
    // Ensure visible
    gsap.set([heroBadge, heroTagline, heroCta].filter(Boolean), { opacity: 1, y: 0 });
    if (heroCta) gsap.set(heroCta.children, { opacity: 1, y: 0 });

    const heroTl = gsap.timeline({ delay: 0.2 });

    if (heroBadge) {
      heroTl.from(heroBadge, { opacity: 0, y: -15, scale: 0.9, duration: 0.5, ease: "back.out(1.7)" });
    }

    if (heroTagline) {
      heroTl.from(heroTagline, { opacity: 0, y: 15, duration: 0.5, ease: "expo.out" }, "-=0.2");
    }

    if (heroCta) {
      heroTl.from(heroCta.children, { opacity: 0, y: 15, duration: 0.4, ease: "expo.out", stagger: 0.1 }, "-=0.2");
    }
  }

  // =====================================
  // Magnetic Button Effect
  // =====================================
  const magneticButtons = document.querySelectorAll('.btn');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)"
      });
    });
  });

  // =====================================
  // Button Text Color Cycling
  // =====================================
  const animatedButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

  animatedButtons.forEach(btn => {
    const originalText = btn.textContent.trim();
    const hasIcon = btn.querySelector('svg');

    if (!hasIcon && originalText) {
      // Wrap text in spans for character animation
      const textNode = Array.from(btn.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
      if (textNode) {
        const chars = originalText.split('').map(char =>
          `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');

        const span = document.createElement('span');
        span.className = 'btn-text';
        span.innerHTML = chars;
        btn.replaceChild(span, textNode);
      }
    }

    btn.addEventListener('mouseenter', () => {
      const chars = btn.querySelectorAll('.char');

      gsap.to(chars, {
        color: (i) => {
          const colors = ['#00ffff', '#ff00ff', '#ff1493'];
          return colors[i % colors.length];
        },
        duration: 0.15,
        stagger: 0.02,
        ease: "power1.out"
      });
    });

    btn.addEventListener('mouseleave', () => {
      const chars = btn.querySelectorAll('.char');

      gsap.to(chars, {
        color: 'inherit',
        duration: 0.15,
        stagger: 0.02,
        ease: "power1.out"
      });
    });
  });

  // =====================================
  // Smooth Scroll with easing
  // =====================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        gsap.to(window, {
          duration: 1,
          scrollTo: {
            y: target,
            offsetY: 80
          },
          ease: "expo.inOut"
        });
      }
    });
  });

  // =====================================
  // Mobile Menu Toggle
  // =====================================
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('active');

      if (!isOpen) {
        navLinks.classList.add('active');
        menuToggle.classList.add('active');

        gsap.fromTo(navLinks.querySelectorAll('li'),
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4, ease: "expo.out", stagger: 0.08 }
        );
      } else {
        gsap.to(navLinks.querySelectorAll('li'), {
          opacity: 0,
          x: -20,
          duration: 0.2,
          stagger: 0.03,
          ease: "expo.in",
          onComplete: () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
          }
        });
      }
    });
  }

  // =====================================
  // Header Scroll Effect
  // =====================================
  const header = document.getElementById('header');

  ScrollTrigger.create({
    start: "top -50",
    onUpdate: (self) => {
      if (self.direction === 1 && self.progress > 0) {
        header.classList.add('scrolled');
      } else if (self.progress === 0) {
        header.classList.remove('scrolled');
      }
    }
  });

  // =====================================
  // Gallery Filter with Animation
  // =====================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.gallery-grid .product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      // Animate out
      gsap.to(productCards, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "expo.in",
        onComplete: () => {
          productCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          });

          // Animate in visible cards
          const visibleCards = Array.from(productCards).filter(
            card => card.style.display !== 'none'
          );

          gsap.fromTo(visibleCards,
            { opacity: 0, scale: 0.8, y: 30 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.5,
              ease: "expo.out",
              stagger: 0.05
            }
          );
        }
      });
    });
  });

  // =====================================
  // Category Modal
  // =====================================
  const modal = document.getElementById('categoryModal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.querySelector('.modal-backdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalGrid = document.getElementById('modalGrid');
  const categoryCards = document.querySelectorAll('.category-card');

  const categoryInfo = {
    'rave-xl': {
      title: 'RAVE XL',
      subtitle: 'Los mas grandes. 66cm de puro flow para festivales epicos.'
    },
    'rave-l': {
      title: 'RAVE L',
      subtitle: 'Versatiles y faciles de llevar. Perfectos para cualquier noche.'
    },
    'medium': {
      title: 'MEDIUM',
      subtitle: 'Para el dia a dia. Livianos, elegantes, tu compañero diario.'
    },
    'personalizados': {
      title: 'PERSONALIZADOS',
      subtitle: 'Tu diseño, dibujado a mano. Unico como vos.'
    }
  };

  const openModal = (category) => {
    const info = categoryInfo[category];
    if (!info) return;

    modalTitle.textContent = info.title;
    modalSubtitle.textContent = info.subtitle;

    const products = document.querySelectorAll(`.product-card[data-category="${category}"]`);
    modalGrid.innerHTML = '';

    products.forEach(product => {
      const clone = product.cloneNode(true);
      clone.style.display = '';
      modalGrid.appendChild(clone);
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Animate modal content
    gsap.fromTo(modal.querySelector('.modal-content'),
      { scale: 0.9, y: 30, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: "expo.out" }
    );

    gsap.fromTo(modalGrid.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: "expo.out", stagger: 0.05, delay: 0.2 }
    );
  };

  const closeModal = () => {
    gsap.to(modal.querySelector('.modal-content'), {
      scale: 0.9,
      y: 30,
      opacity: 0,
      duration: 0.3,
      ease: "expo.in",
      onComplete: () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  };

  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      if (category) openModal(category);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // =====================================
  // Image Hover Parallax
  // =====================================
  const productImages = document.querySelectorAll('.product-image');

  productImages.forEach(container => {
    const img = container.querySelector('img');

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(img, {
        x: x * 10,
        y: y * 10,
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    container.addEventListener('mouseleave', () => {
      gsap.to(img, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "expo.out"
      });
    });
  });

  // =====================================
  // WhatsApp Button Animation
  // =====================================
  const whatsappFloat = document.querySelector('.whatsapp-float');

  if (whatsappFloat) {
    gsap.to(whatsappFloat, {
      y: -10,
      duration: 1.5,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true
    });

    whatsappFloat.addEventListener('mouseenter', () => {
      gsap.to(whatsappFloat, {
        scale: 1.2,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
    });

    whatsappFloat.addEventListener('mouseleave', () => {
      gsap.to(whatsappFloat, {
        scale: 1,
        duration: 0.3,
        ease: "expo.out"
      });
    });
  }

  // =====================================
  // Console Easter Egg
  // =====================================
  console.log('%c⚡ COOL ENERGY ABANICOS', 'font-size: 24px; color: #ff00ff; font-weight: bold;');
  console.log('%cDesmayate de la emocion y no del calor', 'font-size: 14px; color: #00ffff;');
  console.log('%cAnimations powered by GSAP', 'font-size: 12px; color: #666;');
});
