/* global $, document, event */
'use strict';

$(function() {
  var area = $('#text-editor');
  var currentString = area.val().length;
  var countTextarea = $('#count-textarea');
  countTextarea.text(1000 - currentString);
  area.keyup(function(event) {
    currentString = area.val().length;
    if (currentString > 1000) {
      countTextarea.addClass('full');
    } else {
      countTextarea.removeClass('full');
    }
    countTextarea.text(1000 - currentString);
  });
});
