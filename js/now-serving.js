/**
 * Now Serving Status
 * Real-time service indicator for MuNi KC homepage
 *
 * @file        now-serving.js
 * @description Displays current service and upcoming service based on day/time
 * @author      mediaBrilliance digitalxtudio
 * @project     MuNi KC Website
 *
 * Hours (Central Time):
 *   Monday:    Closed
 *   Tue-Fri:   4pm-1:30am (Dinner 4pm-midnight, Bar midnight-1:30am)
 *   Sat-Sun:   10am-1:30am (Brunch 10am-2pm, Bar 2-4pm, Dinner 4pm-midnight, Bar midnight-1:30am)
 *
 * Output Format:
 *   "Now serving [current]" + "[next] at [time]"
 *   "Now closed" + "[next] at [time]"
 */
(function() {
  'use strict';

  // Day constants for readability
  var SUN = 0, MON = 1, TUE = 2, SAT = 6;

  /**
   * Format "Now serving" output with current and next service
   * @param {string} current - Current service (brunch/dinner/bar only)
   * @param {string} next - Next service with time
   * @returns {string} HTML string
   */
  function serving(current, next) {
    return 'Now serving <span class="serving-type">' + current + '</span>' +
           '<span class="serving-next">' + next + '</span>';
  }

  /**
   * Format "Now closed" output with next service
   * @param {string} next - Next service with time
   * @returns {string} HTML string
   */
  function closed(next) {
    return 'Now closed<span class="serving-next">' + next + '</span>';
  }

  /**
   * Check if day is a weekend (Sat/Sun)
   * @param {number} day - Day of week (0-6)
   * @returns {boolean}
   */
  function isWeekend(day) {
    return day === SAT || day === SUN;
  }

  /**
   * Get current serving status based on day and time
   * @returns {string} HTML status message
   */
  function getStatus() {
    var now = new Date();
    var day = now.getDay();
    var time = now.getHours() + now.getMinutes() / 60;
    var yesterday = day === SUN ? SAT : day - 1;

    // ─────────────────────────────────────────────────────────────
    // AFTER MIDNIGHT (12am-1:30am) - Bar carryover from previous night
    // ─────────────────────────────────────────────────────────────
    if (time < 1.5) {
      // Skip if yesterday was Monday (closed) or today is Tuesday (no carryover)
      if (yesterday !== MON && day !== TUE) {
        if (isWeekend(day)) return serving('bar only', 'brunch at 10 am');
        if (day === MON) return serving('bar only', 'dinner tuesday at 4');
        return serving('bar only', 'dinner at 4');
      }
    }

    // ─────────────────────────────────────────────────────────────
    // MONDAY - Closed all day
    // ─────────────────────────────────────────────────────────────
    if (day === MON) {
      return closed('dinner tuesday at 4');
    }

    // ─────────────────────────────────────────────────────────────
    // WEEKEND (Sat/Sun) - Brunch, Bar gap, Dinner, Late Bar
    // ─────────────────────────────────────────────────────────────
    if (isWeekend(day)) {
      if (time < 10) return closed('brunch at 10 am');
      if (time < 14) return serving('brunch', 'dinner at 4');
      if (time < 16) return serving('bar only', 'dinner at 4');
      return serving('dinner', 'bar only at midnight');
    }

    // ─────────────────────────────────────────────────────────────
    // WEEKDAY (Tue-Fri) - Dinner and Late Bar
    // ─────────────────────────────────────────────────────────────
    if (time < 16) return closed('dinner at 4');
    return serving('dinner', 'bar only at midnight');
  }

  /**
   * Update the #now-serving element with current status
   */
  function update() {
    var el = document.getElementById('now-serving');
    if (el) el.innerHTML = getStatus();
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update);
  } else {
    update();
  }

  // Refresh every minute
  setInterval(update, 60000);
})();
