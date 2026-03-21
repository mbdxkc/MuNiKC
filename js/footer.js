/**
 * ==========================================================================
 * MuNi KC - Footer
 * ==========================================================================
 * @file        footer.js
 * @description Dynamic site footer with contact info and navigation
 * @author      mediaBrilliance digitalxtudio
 * @project     MuNi KC Website
 * @version     1.1.0
 * @updated     2026-03-21
 *
 * @layout
 *   Left:   Careers, Contact, Instagram
 *   Center: Address with Google Maps link
 *   Right:  Privacy, Copyright
 *
 * @dependencies
 *   - utils.js (MUNI constants for contact info)
 *   - style.css (.footer, .footer-content classes)
 * ==========================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     CONTACT INFO
     Uses MUNI constants if available, otherwise fallback values
     ========================================================================== */

  const contact = (window.MUNI && window.MUNI.contact) ? window.MUNI.contact : {
    address: '316 Delaware St',
    neighborhood: 'River Market',
    city: 'Kansas City',
    state: 'MO',
    zip: '64105',
    mapsUrl: 'https://www.google.com/maps/dir//316+Delaware+St,+Kansas+City,+MO+64105'
  };

  const social = (window.MUNI && window.MUNI.social) ? window.MUNI.social : {
    instagramUrl: 'https://instagram.com/muni.kansascity'
  };

  const currentYear = new Date().getFullYear();

  /* ==========================================================================
     FOOTER HTML TEMPLATE
     Three-column layout: nav left, address center, legal right
     ========================================================================== */

  const footerHTML = `
    <div class="footer-content">
      <nav class="footer-left" aria-label="footer navigation">
        <a href="./careers.html">Careers</a>
        <a href="./contact.html">Contact</a>
        <a href="${social.instagramUrl}" target="_blank" rel="noopener noreferrer">Instagram</a>
      </nav>
      <address class="footer-center">
        <a href="${contact.mapsUrl}" target="_blank" rel="noopener noreferrer">
          ${contact.address} · ${contact.neighborhood} · ${contact.city}, ${contact.state} ${contact.zip}
        </a>
      </address>
      <div class="footer-right">
        <a href="./privacy.html">Privacy</a>
        <span class="footer-copy">&copy; ${currentYear} MuNi KC</span>
      </div>
    </div>
  `;

  /* ==========================================================================
     DOM INSERTION
     Inject footer HTML into page
     ========================================================================== */

  function insertFooter() {
    const footerEl = document.getElementById('site-footer');
    if (footerEl) {
      footerEl.innerHTML = footerHTML;
    }
  }

  /* ==========================================================================
     INITIALIZATION
     Run when DOM is ready
     ========================================================================== */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertFooter);
  } else {
    insertFooter();
  }

})();
