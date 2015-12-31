/* global $, document, event */
'use strict';

$(function(){
  var area = $('#text-editor');
  var currentString = area.val();
  var countTextarea = $('#count-textarea');
  countTextarea.text('0/1000');

  area.keyup(function(event) {
    currentString = area.val();
    if (currentString.length > 1000) {
      currentString = 1000 - currentString.length;
      countTextarea.text(currentString + '/1000');
    } else {
      countTextarea.text(currentString.length + '/1000');
    }
  });

});
