var socket = {};
var moment = require('moment');

socket.init = function( io ) {

  io.on('connection', function( socket ) {

    var session = socket.handshake.session;

    if(session.user) {

      var dateFormat = 'DD/MM à HH:mm:ss'
      var time = moment().format(dateFormat);

      io.emit('user_connected', session.user.id, session.user.name);
      io.emit('message', time, "CHATBOT", session.user.name + " s'est connecté");

      socket.on('message', function( message ) {
        time = moment().format(dateFormat);
        io.emit('message', time, session.user.name, message);
      });

      socket.on('disconnect', function() {
        time = moment().format(dateFormat);
        io.emit('user_disconnected', session.user.id);
        io.emit('message', time, "CHATBOT", session.user.name + " s'est déconnecté");
      });

    }
  });

};

module.exports = socket;