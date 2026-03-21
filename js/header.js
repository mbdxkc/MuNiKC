/**
 * ==========================================================================
 * MuNi KC - Header
 * ==========================================================================
 * @file        header.js
 * @description Dynamic site header with responsive navigation
 * @author      mediaBrilliance digitalxtudio
 * @project     MuNi KC Website
 * @version     1.1.0
 * @updated     2026-03-21
 *
 * @contents
 *   1. Navigation Configuration - Define menu structure
 *   2. Header Template - HTML for desktop/mobile nav
 *   3. Active State - Highlight current page
 *   4. Mobile Menu - Toggle functionality
 *   5. DOM Insertion - Inject header into page
 *
 * @dependencies
 *   - utils.js (MUNI constants for Instagram URL)
 *   - style.css (.nav, .header-title, .nav-link classes)
 * ==========================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     1) NAVIGATION CONFIGURATION
     Define the menu structure for left and right sides of header
     ========================================================================== */

  /** Links displayed on the left side of the header */
  const navLinksLeft = [
    { href: '/menus.html', label: 'Menus' },
    { href: '/about.html', label: 'About' },
    { href: '/contact.html', label: 'Contact' }
  ];

  /** Links displayed on the right side of the header (currently empty) */
  const navLinksRight = [];

  /** Combined navigation links for mobile menu */
  const navLinks = [...navLinksLeft, ...navLinksRight];

  /** Instagram URL - uses constant if available, otherwise fallback */
  const instagramUrl = (window.MUNI && window.MUNI.social)
    ? window.MUNI.social.instagramUrl
    : 'https://instagram.com/muni.kansascity';

  /* ==========================================================================
     2) HEADER HTML TEMPLATE
     Desktop header with centered title, left/right nav, and social links
     ========================================================================== */

  const headerHTML = `
    <div class="header-grid">
      <nav class="nav" aria-label="main navigation" role="navigation">
        <div class="nav-left">
          <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div class="pages">
            ${navLinksLeft.map(link =>
              `<a href="${link.href}" class="nav-link">${link.label}</a>`
            ).join('')}
          </div>
        </div>
        <div class="header-title">
          <a href="/">MuNi Bar and Eatery</a>
        </div>
        <div class="nav-right">
          <div class="pages">
            ${navLinksRight.map(link =>
              `<a href="${link.href}" class="nav-link">${link.label}</a>`
            ).join('')}
          </div>
          <div class="socials">
            <a href="${instagramUrl}" class="nav-link" aria-label="Follow us on Instagram" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </nav>
    </div>
  `;

  /* ==========================================================================
     3) MOBILE MENU HTML TEMPLATE
     Full-screen mobile navigation menu
     ========================================================================== */

  const mobileMenuHTML = `
    ${navLinks.map(link =>
      `<a href="${link.href}" class="nav-link">${link.label}</a>`
    ).join('')}
    <hr class="divider">
    <a href="/careers.html" class="nav-link">Careers</a>
  `;

  /* ==========================================================================
     4) SET ACTIVE NAV LINK
     Highlight the current page in navigation
     ========================================================================== */

  function setActiveNav() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '/' && href === '/')) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ==========================================================================
     5) MOBILE MENU TOGGLE
     Handle hamburger menu click and body scroll lock
     ========================================================================== */

  function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (!toggle || !mobileMenu) return;

    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-active');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('menu-open', isOpen);
    });
  }

  /* ==========================================================================
     6) DOM INSERTION
     Inject header and mobile menu HTML into page
     ========================================================================== */

  function insertHeader() {
    const headerEl = document.getElementById('site-header');
    const mobileMenuEl = document.querySelector('.mobile-menu');

    if (headerEl) {
      headerEl.innerHTML = headerHTML;
    }
    if (mobileMenuEl) {
      mobileMenuEl.id = 'mobile-menu';
      mobileMenuEl.innerHTML = mobileMenuHTML;
    }

    setActiveNav();
    initMobileMenu();
  }

  /* ==========================================================================
     7) INITIALIZATION
     Run when DOM is ready
     ========================================================================== */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertHeader);
  } else {
    insertHeader();
  }

})();
