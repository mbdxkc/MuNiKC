/**
 * Now Serving Status
 * Displays current service status based on time of day
 *
 * Hours (Central Time):
 * - Monday: Closed
 * - Tuesday-Friday: 4pm-1:30am (Kitchen until midnight)
 * - Saturday-Sunday: 10am-1:30am (Brunch 10am-2pm, Kitchen until midnight)
 */
(function() {
  'use strict';

  /**
   * Get current serving status based on day and time
   * @returns {string} Status message
   */
  function getServingStatus() {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon, 2=Tue, etc.
    const hour = now.getHours();
    const minute = now.getMinutes();
    const time = hour + minute / 60; // Decimal time for easier comparison

    // After midnight (12am-1:30am) - drinks only if previous day was open
    // Must check first before day-specific logic
    if (time < 1.5) {
      const yesterday = day === 0 ? 6 : day - 1;
      // Yesterday wasn't Monday (closed) and wasn't Tuesday (since Monday closed, no carryover)
      if (yesterday !== 1 && day !== 2) {
        return 'Now serving <span class="serving-type">drinks</span>';
      }
      // After 1:30am or carryover from closed day
      if (day === 1) {
        return 'Now closed, see you Tuesday';
      }
    }

    // Monday (day 1) - always closed
    if (day === 1) {
      return 'Now closed, see you Tuesday';
    }

    // Saturday (6) or Sunday (0)
    if (day === 0 || day === 6) {
      // Before 10am - closed
      if (time < 10) {
        return 'Now closed, see you at 10am';
      }
      // 10am-2pm - brunch
      if (time < 14) {
        return 'Now serving <span class="serving-type">brunch</span>';
      }
      // 2pm-4pm - drinks only (kitchen closed)
      if (time < 16) {
        return 'Now serving <span class="serving-type">drinks</span>';
      }
      // 4pm-midnight - dinner
      if (time < 24) {
        return 'Now serving <span class="serving-type">dinner</span>';
      }
    }

    // Tuesday-Friday (2-5)
    if (day >= 2 && day <= 5) {
      // Before 4pm - closed
      if (time < 16) {
        return 'Now closed, see you at 4pm';
      }
      // 4pm-midnight - dinner
      if (time < 24) {
        return 'Now serving <span class="serving-type">dinner</span>';
      }
    }

    // Default closed message
    if (day === 0) {
      return 'Now closed, see you Tuesday';
    }
    return 'Now closed, see you Tuesday';
  }

  /**
   * Update the now-serving element
   */
  function updateStatus() {
    const el = document.getElementById('now-serving');
    if (el) {
      el.innerHTML = getServingStatus();
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateStatus);
  } else {
    updateStatus();
  }

  // Update every minute
  setInterval(updateStatus, 60000);
})();
