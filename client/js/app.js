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
    if(customAttrs[attrName]) customAttrs[attrName].call(attrs, attrs[attrName]);
  }
  return m(selector, attrs, children);
}

var customAttrs = {
  cautions: function(callback) {
    this.onclick = function(e) {
      var messageSelected = $(this).data('message');
      var deleteMessage = $('#deleteMessage');
      $('#messageSelected').html(messageSelected);
      deleteMessage.modal();
      deleteMessage.find('button[role="delete"]').click(function(e) {
        deleteMessage.modal('hide');
        callback(e);
      });
    }
  }
}
