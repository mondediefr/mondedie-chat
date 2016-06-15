/* global $, document, window, messages, event, textarea, socket, Tether */
'use strict';

$(function() {
  /**
   * Markdown editor
   */
  $('#text-editor').markdown({
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
          toggle: true,
          title: 'smiley',
          icon: 'fa fa-smile-o',
          callback: popupSmiley
        }]
      }]
    ]
  });

  function popupSmiley() {
    var divSmileys = $('#content-smileys');
    var button = $('.fa.fa-smile-o').parent();
    var popup = new Tether({
      element: divSmileys,
      target: button,
      attachment: 'bottom center',
      targetAttachment: 'top center',
      //offset: '10px 0',
      constraints: [{
        to: 'window',
        attachment: 'together'
      }]
    })
    button.click(function(event) {
      popup.position();
      divSmileys.show();
    });
    $(document).click(function(event) {
      if (!$(event.target).parents().andSelf().is(button)) {
        divSmileys.hide();
      }
    });
    divSmileys.click(function(event) {
      event.stopPropagation();
    });
  }

  /**
  * notification user typing
  */
  var typingTimeout;
  var isTyping = false;

  textarea.onkeydown = function(e) {
    e = e || event;
    if(e.keyCode === 13 && !e.shiftKey) {
      var display = window.getComputedStyle(
        document.getElementById('textcomplete-dropdown-1')
      ).getPropertyValue('display');
      if(!document.getElementById('disable-enter-action').checked && display != 'block') {
        e.preventDefault();
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(timeoutHandler, 0);
        if(textarea.value.length > 0)
          messages.vm.send();
        else
          textarea.value = '';
      }
    }
    if(textarea.value.length > 1) {
      if(e.keyCode !== 13 && textarea.value.charAt(0) !== '/') {
        if(!isTyping) {
          isTyping = true;
          socket.emit('typing', isTyping);
        } else clearTimeout(typingTimeout);
        typingTimeout = setTimeout(timeoutHandler, 5000);
      }
    }
    return true;
  }

  function timeoutHandler() {
    isTyping = false;
    socket.emit('typing', isTyping);
  }

  /**
  * counter characters in the textarea
  */
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
