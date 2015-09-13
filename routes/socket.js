var socket = {};

socket.init = function( io ) {

  io.on('connection', function( socket ) {

    var session = socket.handshake.session;

    if(session.user) {

      io.emit('user_connected', session.user.id, session.user.name);
      io.emit('message', "CHATBOT", session.user.name + " s'est connecté");

      socket.on('message', function( message ){
        io.emit('message', session.user.name, message);
      });

      socket.on('disconnect', function(){
        io.emit('user_disconnected', session.user.id);
        io.emit('message', "CHATBOT", session.user.name + " s'est déconnecté");
      });

    }
  });

};

module.exports = socket;