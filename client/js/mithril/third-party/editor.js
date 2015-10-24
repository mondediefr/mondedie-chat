/* global $, document, messages, event, textarea */
'use strict';

$(function(){

  /**
  * Markdown editor
  */
  $("#text-editor").markdown({
    autofocus: true,
    savable: false,
    iconlibrary: 'fa',
    height: 110,
    language: 'fr',
    hiddenButtons: ['cmdPreview'],
    additionalButtons: [
    [{
      name: 'groupCustom', data: [{
        name: 'cmdSmiley',
        toggle: true, // this param only take effect if you load bootstrap.js
        title: 'smiley',
        icon: 'fa fa-smile-o', callback: function(e) {
          console.log('Do something...');
        }
      }]
    }]
  ]
  });

  textarea.onkeydown = function(e) {
    e = e || event;
    if(e.keyCode === 13 && !e.shiftKey) {
      if(!document.getElementById('disable-enter-action').checked) {
        e.preventDefault();
        if(textarea.value.length > 0)
          messages.vm.send();
        else
          textarea.value = null;
      }
    }
    return true;
  }

});
