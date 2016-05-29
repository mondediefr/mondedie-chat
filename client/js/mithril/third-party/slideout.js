/* global document, Slideout */
'use strict';

/**
 * Slideout plugin
 */
var slideout = new Slideout({
  'panel': document.getElementById('panel'),
  'menu': document.getElementById('menu'),
  'padding': 225,
  'tolerance': 70, //only when touch is available
  'touch': false,
  'side': 'left'
});
