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
  var status = slideoutLeft.toggle();
  var oppositeMenu = $('#right-menu');
  if (status._opened === true)
    oppositeMenu.hide();
  else
    oppositeMenu.delay(200).show(0);
});

/**
 * Slideout right menu
 */
var slideoutRight = new Slideout({
  'panel': document.getElementById('panel'),
  'menu': document.getElementById('right-menu'),
  'padding': 225,
  'tolerance': 70,
  'touch': false,
  'side': 'right'
});

$('#right-nav').click(function() {
  var status = slideoutRight.toggle();
  var oppositeMenu = $('#left-menu');
  if (status._opened === true)
    oppositeMenu.hide();
  else
    oppositeMenu.show();
});
