/* global $, document, Slideout */
'use strict';

/**
 * Slideout left menu
 */
var slideoutLeft = new Slideout({
  'panel': document.getElementById('panel'),
  'menu': document.getElementById('left-menu'),
  'padding': 225,
  'tolerance': 70, //only when touch is available
  'touch': false,
  'side': 'left'
});

$('#left-nav').click(function() {
  slideoutLeft.toggle();
  $('#right-menu').hide();
  $('#left-menu').show();
});

/**
 * Slideout right menu
 */
var slideoutRight = new Slideout({
  'panel': document.getElementById('panel'),
  'menu': document.getElementById('right-menu'),
  'padding': 225,
  'tolerance': 70, //only when touch is available
  'touch': false,
  'side': 'right'
});

$('#right-nav').click(function() {
  slideoutRight.toggle();
  $('#left-menu').hide();
  $('#right-menu').show();
});
