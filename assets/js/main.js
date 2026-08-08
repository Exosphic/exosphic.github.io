document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Elements
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .header-cta');
  
  if (navToggle && navMenu) {
    const focusableElements = navMenu.querySelectorAll('a, button');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const toggleMenu = (shouldOpen) => {
      const isOpen = shouldOpen !== undefined ? shouldOpen : navToggle.getAttribute('aria-expanded') === 'false';
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.classList.toggle('active', isOpen);
      navMenu.classList.toggle('active', isOpen);
      
      if (isOpen) {
        // Prevent background scrolling while menu is open on mobile
        document.body.style.overflow = 'hidden';
        // Direct focus to the first link inside menu
        if (firstFocusable) {
          firstFocusable.focus();
        }
      } else {
        document.body.style.overflow = '';
      }
    };

    // Toggle menu click handler
    navToggle.addEventListener('click', () => toggleMenu());

    // Auto-close menu when selecting links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          toggleMenu(false);
          navToggle.focus();
        }
      });
    });

    // Close menu when clicking outside of the active container
    document.addEventListener('click', (event) => {
      const isClickInsideMenu = navMenu.contains(event.target);
      const isClickOnToggle = navToggle.contains(event.target);
      if (navMenu.classList.contains('active') && !isClickInsideMenu && !isClickOnToggle) {
        toggleMenu(false);
      }
    });

    // Keyboard navigation enhancements (Focus trap & Escape to close)
    document.addEventListener('keydown', (event) => {
      if (!navMenu.classList.contains('active')) return;

      // Close menu with Escape key
      if (event.key === 'Escape') {
        toggleMenu(false);
        navToggle.focus();
      }

      // Keep focus inside the hamburger menu loop
      if (event.key === 'Tab') {
        if (event.shiftKey) { // Shift + Tab
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            event.preventDefault();
          }
        }
      }
    });
  }

  // Smooth scroll focus adjustment for screen-readers and keyboard users
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        // Temporarily apply tabindex to direct keyboard focus safely
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
        
        targetElement.addEventListener('blur', () => {
          targetElement.removeAttribute('tabindex');
        }, { once: true });
      }
    });
  });
});
