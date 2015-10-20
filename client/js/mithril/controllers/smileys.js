'use strict';
var smileys = smileys || {};

/**
 * Smileys component - controller
 */
smileys.controller = function() {
  this.smileys = smileys.list.get();
};