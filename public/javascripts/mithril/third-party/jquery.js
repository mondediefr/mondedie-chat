/* global $, document, editor, socket */
'use strict';

$(function(){

  /**
  * jQuery bindings
  * @todo Convertir le code suivant avec Mihtril
  */
  $('#afk').click(function(e) {
    editor.value('/afk on|off');
    e.preventDefault();
  });

  $('#pm').click(function(e) {
    editor.value('/msg user message');
    e.preventDefault();
  });

  $('#banLink').click(function(e) {
    $('#banPopup').modal();
    e.preventDefault();
  });

  $('#banList').click(function(e) {
    socket.emit('banlist');
    e.preventDefault();
  });

  $('#banPopup').find('button[role="ban"]').click(function(e) {
    var username = $('input[name="userBanned"]').val();
    socket.emit('ban', username);
    $('#banPopup').modal('hide');
    e.preventDefault();
  });

  $('#banPopup').find('button[role="unban"]').click(function(e) {
    var username = $('input[name="userBanned"]').val();
    socket.emit('unban', username);
    $('#banPopup').modal('hide');
    e.preventDefault();
  });

  $(document).on('click', '.username', function() {
    var username = $(this).text();
    editor.value('**@' + username + ':** ');
  });

});