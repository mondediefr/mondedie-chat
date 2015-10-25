/* global $, document, messages, event, textarea, socket */
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

  var typingTimeout;
  var isTyping = false;

  textarea.onkeydown = function(e) {
    e = e || event;
    if(e.keyCode === 13 && !e.shiftKey) {
      if(!document.getElementById('disable-enter-action').checked) {
        e.preventDefault();
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(timeoutHandler, 0);
        if(textarea.value.length > 0)
          messages.vm.send();
        else
          textarea.value = null;
      }
    }
    if(e.keyCode !== 13) {
      if(!isTyping) {
        isTyping = true;
        socket.emit('typing', isTyping);
      } else clearTimeout(typingTimeout);
      typingTimeout = setTimeout(timeoutHandler, 5000);
    }
    return true;
  }

  function timeoutHandler() {
    isTyping = false;
    socket.emit('typing', isTyping);
  }
});
