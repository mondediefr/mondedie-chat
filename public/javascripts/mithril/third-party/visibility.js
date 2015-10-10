/* global $, document, Visibility */
'use strict';

$(function(){

  /**
  * Visibility plugin
  */
  Visibility.change(function (e, state) {
    if(state === 'visible')
      document.title = 'Mondedie-chat - Chatroom';
  });

});