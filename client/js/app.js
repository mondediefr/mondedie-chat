/* global $, document, io, m, window */
'use strict';
var socket = io.connect('/', {'forceNew': true});

/**
 * Mithril namespaces
 */
var messages = messages || {};
var users    = users    || {};
var smileys  = smileys  || {};

/**
 * Views DOM anchors
 */
var messagesViewElement = document.getElementById('content-messages');
var usersViewElement    = document.getElementById('content-users');
var smileysViewElement  = document.getElementById('content-smileys');
var typingViewElement   = document.getElementById('content-typing');

/**
 * DOM elements
 */
var textarea = document.getElementById('text-editor');

/**
 * View Extending
 */
var mx = function(selector, attrs, children) {
  for(var attrName in attrs) {
    if(customAttrs[attrName])
      customAttrs[attrName].call(attrs, attrs[attrName]);
  }
  return m(selector, attrs, children);
}

var customAttrs = {
  cautions: function(callback) {
    this.onclick = function(e) {
      m.redraw.strategy('none');
      var dataMessage = $(this);
      var modaldeleteMessage = $('#deleteMessage');
      var messageSelected = dataMessage.parent('.message');

      messageSelected.addClass('remove');
      $('#deleteMessage').on('hidden.bs.modal', function(e) {
        messageSelected.removeClass('remove');
      })

      var content = dataMessage.data('content');
      var groupColor = dataMessage.data('groupcolor');
      var date = dataMessage.data('date');
      var username = dataMessage.data('username');
      var html = '<span class="modal-username" style="color:'+ groupColor +'">' + username + '</span>'+
      '<span class="date">'+ date +'</span>';

      $('#messageInfo').html(html);
      $('#messageSelected').html(content);

      modaldeleteMessage.modal();

      $('button[role="delete"]').click(function(e) {
        modaldeleteMessage.modal('hide');
        callback(e);
      });
    }
  }
}
