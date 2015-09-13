var socket = io();

$('.form-chat').submit(function(){
  send($('#message').val());
  $('#message').val('');
  return false;
});

socket.on('user_connected', function( userid, username ) {
  console.log('user_connected > ' + userid + ':' + username);
  $("ul#clients").append("<li class=\"" + userid + "\">" + username + "</li>");
});

socket.on('user_disconnected', function( userid ) {
  console.log('user_disconnected > ' + userid);
  $("ul#clients li." + userid).remove();
});

socket.on('message', function( username, message ){
  console.log('message > ' + username + ':' + message);
  add( username, message );
});

var send = function( message ) {
  socket.emit('message', message);
};

var add = function( username, message ) {
  $('#messages').append($('<li>').text( username + ': ' + message ));
  $("#messages").scrollTop($("#messages")[0].scrollHeight);
};