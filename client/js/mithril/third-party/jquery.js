/* global $, document, editor, socket, notify, textarea, slideout, localStorage */
'use strict';

$(function() {

  notify.config({
    pageVisibility:true,
    autoClose:10000
  });

  if(notify.permissionLevel() === notify.PERMISSION_DEFAULT)
    notify.requestPermission();

  if(notify.permissionLevel() === notify.PERMISSION_GRANTED)
    $('#notification').remove();

  $('#afk').click(function(e) {
    textarea.value = '/afk on|off';
    textarea.focus();
    e.preventDefault();
  });

  $('#pm').click(function(e) {
    textarea.value = '/msg @';
    textarea.focus();
    e.preventDefault();
  });

  $('#poke').click(function(e) {
    textarea.value = '/poke @';
    textarea.focus();
    e.preventDefault();
  });

  $('#roll').click(function(e) {
    textarea.value = '/roll 1d6';
    textarea.focus();
    e.preventDefault();
  });

  $('#rolluser').click(function(e) {
    textarea.value = '/roll @';
    textarea.focus();
    e.preventDefault();
  });

  $('#notification').click(function(e) {
    notify.requestPermission();
    $('#notification').remove();
    e.preventDefault();
  });

  $('#unlock').click(function(e) {
    textarea.value = '/unlock @';
    textarea.focus();
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
    textarea.value = textarea.value + '@' + username;
    textarea.focus();
  });

  $('#toggle-button').click(function(e) {
    slideout.toggle();
  });

  $('input[type="checkbox"]').each(function() {
    if(localStorage.getItem($(this).attr('id')) !== null) {
      $(this).attr("checked", "checked");
    }
  });

  $('input[type="checkbox"]').click(function () {
    if($(this).is(':checked')) {
      localStorage.setItem($(this).attr('id'), $(this).val());
    } else {
      localStorage.removeItem($(this).attr('id'));
    }
  });

});
