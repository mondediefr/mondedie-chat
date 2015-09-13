var socket = io();

$('.form-chat').submit(function(){
  send($('#message').val());
  $('#message').val('');
  return false;
});

socket.on('user_connected', function( user ) {
  $("ul#clients").append('<li style="color:' + user.groupColor + ';" class="' + user.id + '">' + user.name + '</li>');
});

socket.on('user_disconnected', function( userid ) {
  $("ul#clients li." + userid).remove();
});

socket.on('message', function( time, user, message ) {
  addMessage( time, user, message );
});
socket.on('botMessage', function( time, message ) {
  addBotMessage( time, message );
});

var send = function( message ) {
  socket.emit('message', message);
};

var addMessage = function( time, user, message ) {

  $('#messages').append('<li>(' + time + ') <b><span style="color:' + user.groupColor + ';">' + user.name + '</span>:</b> ' + message + '</li>');
  $("#messages").scrollTop($("#messages")[0].scrollHeight);

};

var addBotMessage = function( time, message ) {

  $('#messages').append('<li class="message-bot">(' + time + ') <b>CHATBOT:</b> ' + message + '</li>');
  $("#messages").scrollTop($("#messages")[0].scrollHeight);

};