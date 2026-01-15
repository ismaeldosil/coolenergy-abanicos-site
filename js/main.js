/**
 * Cool Energy Abanicos - Main JavaScript
 * Interactividad del sitio institucional
 */

document.addEventListener('DOMContentLoaded', () => {
  // =====================================
  // Mobile Menu Toggle
  // =====================================
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Cerrar menu al hacer click en un link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }

  // =====================================
  // Header Scroll Effect
  // =====================================
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // =====================================
  // Smooth Scroll
  // =====================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // =====================================
  // Scroll Reveal Animation
  // =====================================
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('revealed');
      }
    });
  };

  // Initial check
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);

  // =====================================
  // Gallery Filter
  // =====================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      productCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.classList.add('revealed');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =====================================
  // Lazy Load Images Enhancement
  // =====================================
  const images = document.querySelectorAll('img[loading="lazy"]');

  images.forEach(img => {
    img.addEventListener('load', function() {
      this.classList.add('loaded');
    });

    // If already loaded (from cache)
    if (img.complete) {
      img.classList.add('loaded');
    }
  });

  // =====================================
  // Product Card Hover Effects
  // =====================================
  productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // =====================================
  // WhatsApp Button Pulse Animation
  // =====================================
  const whatsappFloat = document.querySelector('.whatsapp-float');
  if (whatsappFloat) {
    // Add pulse every few seconds
    setInterval(() => {
      whatsappFloat.classList.add('pulse');
      setTimeout(() => {
        whatsappFloat.classList.remove('pulse');
      }, 1000);
    }, 5000);
  }

  // =====================================
  // Category Cards Animation on Scroll
  // =====================================
  const categoryCards = document.querySelectorAll('.category-card');

  categoryCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
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

  // Category info for modal
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

  // Open modal when clicking category cards
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      if (!category) return;

      // Set modal content
      const info = categoryInfo[category];
      modalTitle.textContent = info.title;
      modalSubtitle.textContent = info.subtitle;

      // Get products for this category
      const products = document.querySelectorAll(`.product-card[data-category="${category}"]`);

      // Clone products to modal
      modalGrid.innerHTML = '';
      products.forEach(product => {
        const clone = product.cloneNode(true);
        clone.style.display = '';
        clone.classList.remove('revealed');
        modalGrid.appendChild(clone);
      });

      // Open modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // =====================================
  // Console Easter Egg
  // =====================================
  console.log('%c🌀 COOL ENERGY ABANICOS', 'font-size: 24px; color: #ff00ff; font-weight: bold;');
  console.log('%cDesmayate de la emocion y no del calor', 'font-size: 14px; color: #00ffff;');
  console.log('%c¿Queres trabajar con nosotros? Escribinos!', 'font-size: 12px; color: #666;');
});

// Add revealed class CSS
const style = document.createElement('style');
style.textContent = `
  [data-reveal] {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  [data-reveal].revealed {
    opacity: 1;
    transform: translateY(0);
  }

  img.loaded {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .whatsapp-float.pulse {
    animation: pulse 1s ease;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;
document.head.appendChild(style);
