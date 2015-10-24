/* global $, document, messages, event, textarea */
'use strict';

$(function(){

  /**
  * Markdown editor
  */
  $("#text-editor").markdown({
    autofocus:true,
    savable:false,
    iconlibrary:'fa',
    height:125
  });

  textarea.onkeydown = function(e) {
    e = e || event;
    if(e.keyCode === 13 && !document.getElementById('disable-enter-action').checked) {
      e.preventDefault();
      if(textarea.value.length > 0)
        messages.vm.send();
      else
        textarea.value = null;
    }
    return true;
  }

});
