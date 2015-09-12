var socket = io();

$('.form-chat').submit(function(){
    socket.emit('chat message', $('#message').val());
    $('#message').val('');
    return false;
});

socket.on('chat message', function( message ){
  $('#messages').append($('<li>').text( message ));
});