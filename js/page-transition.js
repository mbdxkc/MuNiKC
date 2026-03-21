/**
 * ==========================================================================
 * MuNi KC - Page Transitions
 * ==========================================================================
 * @file        page-transition.js
 * @description Smooth fade transitions between pages with warm aesthetic
 * @author      mediaBrilliance digitalxtudio
 * @project     MuNi KC Website
 * @version     1.2.0
 * @updated     2026-03-21
 *
 * @mechanism
 *   Entry: Inline <script> in <head> adds .is-entering to <html> before paint
 *          This JS removes it after 50ms, triggering CSS fade-in
 *   Exit:  Click handler adds .is-leaving, waits for transition, navigates
 *
 * @classes
 *   html.is-entering  - Applied before first paint, removed to fade in
 *   html.is-leaving   - Applied on navigation, content fades out
 *   #page-transition.active - Warm overlay during exit transition
 *
 * @dependencies
 *   - style.css (transition styles, --t-slow timing variable)
 *   - Inline script in each HTML <head>:
 *     <script>document.documentElement.classList.add('is-entering');</script>
 *
 * @a11y
 *   - Respects prefers-reduced-motion
 *   - Falls back to instant navigation when motion disabled
 * ==========================================================================
 */

(function () {
  'use strict';

  const transition = document.getElementById('page-transition');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Initialize page entrance
   * Removes is-entering class to trigger fade-in animation
   */
  function init() {
    if (prefersReducedMotion) {
      document.documentElement.classList.remove('is-entering');
      return;
    }

    // Brief delay ensures CSS transition triggers
    setTimeout(function() {
      document.documentElement.classList.remove('is-entering');
    }, 50);
  }

  /**
   * Handle internal link clicks
   * Intercepts same-origin links and applies exit transition
   */
  function handleNavigation() {
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a');

      // Ignore non-links
      if (!link) return;

      // Ignore external links
      if (link.hostname !== window.location.hostname) return;

      // Ignore downloads and new tabs
      if (link.hasAttribute('download')) return;
      if (link.getAttribute('target') === '_blank') return;

      // Ignore same-page anchor links
      if (link.hash && link.pathname === window.location.pathname) return;

      // Ignore modifier key combos (open in new tab, etc.)
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      e.preventDefault();
      navigateTo(link.href);
    });
  }

  /**
   * Navigate with exit transition
   * @param {string} url - Destination URL
   */
  function navigateTo(url) {
    if (prefersReducedMotion) {
      window.location.href = url;
      return;
    }

    // Trigger exit animation
    document.documentElement.classList.add('is-leaving');

    if (transition) {
      transition.classList.add('active');
    }

    // Read transition duration from CSS custom property
    var duration = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--t-slow')
    ) * 1000 || 600;

    // Navigate after transition completes
    setTimeout(function () {
      window.location.href = url;
    }, duration);
  }

  /**
   * Handle browser back/forward navigation
   * Shows transition overlay during history navigation
   */
  function handlePopState() {
    window.addEventListener('popstate', function () {
      if (transition) {
        transition.classList.add('active');
      }
    });
  }

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
      handleNavigation();
      handlePopState();
    });
  } else {
    init();
    handleNavigation();
    handlePopState();
  }

})();
