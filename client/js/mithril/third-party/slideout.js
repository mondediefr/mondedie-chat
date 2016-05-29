/* global $, document, Slideout */
'use strict';

$(function(){

  /**
   * Slideout plugin
   */
  var slideout = new Slideout({
    'panel': document.getElementById('panel'),
    'menu': document.getElementById('menu'),
    'padding': 225,
    'tolerance': 90
  });

});
