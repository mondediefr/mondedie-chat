var socket = io();

$('.form-chat').submit(function(){
  send($('#message').val());
  $('#message').val('');
  return false;
});

socket.on('user_connected', function( userid, username ) {
  $("ul#clients").append("<li class=\"" + userid + "\">" + username + "</li>");
});

socket.on('user_disconnected', function( userid ) {
  $("ul#clients li." + userid).remove();
});

socket.on('message', function( time, username, message ) {
  add( time, username, message );
});

var send = function( message ) {
  socket.emit('message', message);
};

var add = function( time, username, message ) {

  var liClass = "";

  if(username == "CHATBOT") {
    liClass = 'class="message-bot"';
  }

  $('#messages').append('<li ' + liClass + '>(' + time + ') <b>' + username + ':</b> ' + message + '</li>');
  $("#messages").scrollTop($("#messages")[0].scrollHeight);
};