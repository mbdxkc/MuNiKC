/**
 * ==========================================================================
 * MuNi KC - Utilities
 * ==========================================================================
 * @file        utils.js
 * @description Common UI interactions and shared functionality
 * @author      mediaBrilliance digitalxtudio
 * @project     MuNi KC Website
 * @version     1.1.0
 * @updated     2026-03-21
 *
 * @contents
 *   1. Site Constants - Centralized configuration
 *   2. Mobile Navigation - Toggle menu, keyboard support
 *   3. Smooth Scroll - Anchor link handling
 *   4. Carousels - Gallery and Instagram carousel logic
 *   5. Back to Top - Show/hide scroll button
 *   6. Initialization - DOMContentLoaded setup
 * ==========================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     1) SITE CONSTANTS
     Centralized values for easy maintenance
     ========================================================================== */

  window.MUNI = {
    contact: {
      email: 'Munihospitality@gmail.com',
      address: '316 Delaware St',
      city: 'Kansas City',
      state: 'MO',
      zip: '64105',
      neighborhood: 'River Market',
      mapsUrl: 'https://www.google.com/maps/dir//316+Delaware+St,+Kansas+City,+MO+64105'
    },
    social: {
      instagram: 'muni.kansascity',
      instagramUrl: 'https://instagram.com/muni.kansascity',
      yelp: 'muni-kansas-city'
    },
    hours: {
      closed: ['Monday'],
      dinner: { days: 'Tue-Fri', open: '4pm', close: '1:30am' },
      weekend: { days: 'Sat-Sun', open: '10am', close: '1:30am' },
      brunch: { days: 'Sat-Sun', open: '10am', close: '2pm' }
    }
  };

  /* ==========================================================================
     2) MOBILE NAVIGATION
     Handles hamburger menu toggle with keyboard accessibility
     ========================================================================== */

  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.mobile-menu');

    if (!toggle || !menu) return;

    // Toggle menu on button click
    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.contains('is-active');
      menu.classList.toggle('is-active');
      toggle.setAttribute('aria-expanded', String(!isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-active')) {
        menu.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking a navigation link
    menu.addEventListener('click', function (e) {
      if (e.target.matches('a')) {
        menu.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ==========================================================================
     3) SMOOTH SCROLL
     Handles anchor link scrolling with header offset
     ========================================================================== */

  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = link.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Calculate scroll position accounting for fixed header
      var headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
      var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update URL without triggering scroll
      history.pushState(null, '', targetId);
    });
  }

  /* ==========================================================================
     4) CAROUSELS
     Handles gallery and Instagram carousels with responsive slide counts
     ========================================================================== */

  function initCarousels() {
    // Gallery carousel - 3 slides desktop, 2 tablet, 1 mobile
    initSingleCarousel('.gallery-carousel', function() {
      if (window.innerWidth <= 480) return 1;
      if (window.innerWidth <= 768) return 2;
      return 3;
    });

    // Instagram feed now handled by Behold.so widget (auto-updating)
  }

  /**
   * Initialize a single carousel instance
   * @param {string} selector - CSS selector for carousel container
   * @param {function} getSlidesPerView - Returns number of visible slides based on viewport
   */
  function initSingleCarousel(selector, getSlidesPerView) {
    var carousel = document.querySelector(selector);
    if (!carousel) return;

    var track = carousel.querySelector('.carousel-track');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var prevBtn = carousel.querySelector('.carousel-btn-prev');
    var nextBtn = carousel.querySelector('.carousel-btn-next');

    if (!track || slides.length === 0) return;

    var currentIndex = 0;
    var slidesPerView = getSlidesPerView();
    var gap = 16; // Gap between slides in pixels

    /** Update carousel position based on current index */
    function updateCarousel() {
      var slideWidth = slides[0].offsetWidth + gap;
      track.style.transform = 'translateX(-' + (currentIndex * slideWidth) + 'px)';
    }

    /** Advance to next slide, with VHS rewind at end */
    function nextSlide() {
      var maxIndex = Math.max(0, slides.length - slidesPerView);
      if (currentIndex >= maxIndex) {
        // Trigger VHS rewind effect
        carousel.classList.add('rewinding');
        currentIndex = 0;
        updateCarousel();
        // Remove effect after animation completes
        setTimeout(function() {
          carousel.classList.remove('rewinding');
        }, 1250);
      } else {
        currentIndex++;
        updateCarousel();
      }
    }

    /** Go to previous slide, wrapping to end if at start */
    function prevSlide() {
      var maxIndex = Math.max(0, slides.length - slidesPerView);
      currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
      updateCarousel();
    }

    // Attach button event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Recalculate on window resize
    window.addEventListener('resize', function () {
      slidesPerView = getSlidesPerView();
      currentIndex = Math.min(currentIndex, Math.max(0, slides.length - slidesPerView));
      updateCarousel();
    });
  }

  /* ==========================================================================
     5) BACK TO TOP BUTTON
     Show/hide button based on scroll position
     ========================================================================== */

  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    var scrollThreshold = 300;

    function toggleVisibility() {
      if (window.scrollY > scrollThreshold) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }

    // Scroll to top on click
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Check on scroll with throttle
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          toggleVisibility();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial check
    toggleVisibility();
  }

  /* ==========================================================================
     6) INITIALIZATION
     Run setup functions when DOM is ready
     ========================================================================== */

  function init() {
    initMobileNav();
    initSmoothScroll();
    initCarousels();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
