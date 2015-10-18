/* global $, document, editor, socket, notify */
'use strict';

$(function() {

  notify.config({ pageVisibility:true });

  if(notify.permissionLevel() === notify.PERMISSION_DEFAULT)
    notify.requestPermission();

  if(notify.permissionLevel() === notify.PERMISSION_GRANTED)
    $('#notification').remove();

  $('#afk').click(function(e) {
    editor.value('/afk on|off');
    e.preventDefault();
  });

  $('#pm').click(function(e) {
    editor.value('/msg user message');
    e.preventDefault();
  });

  $('#poke').click(function(e) {
    editor.value('/poke user');
    e.preventDefault();
  });

  $('#roll').click(function(e) {
    editor.value('/roll 1d6');
    e.preventDefault();
  });

  $('#notification').click(function(e) {
    notify.requestPermission();
    $('#notification').remove();
    e.preventDefault();
  });

  $('#unlock').click(function(e) {
    editor.value('/unlock user');
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
