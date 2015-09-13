var socket = {};
var moment = require('moment');
var xss    = require('node-xss').clean;

socket.init = function( io ) {

  io.on('connection', function( socket ) {

    var session = socket.handshake.session;

    if( session.user ) {

      var dateFormat = 'DD/MM à HH:mm:ss'
      var time = moment().format( dateFormat );

      io.emit('user_connected', session.user);
      io.emit('botMessage', time, session.user.name + " s'est connecté");

      socket.on('message', function( message ) {
        time = moment().format( dateFormat );
        io.emit('message', time, session.user, xss(message));
      });

      socket.on('disconnect', function() {
        time = moment().format( dateFormat );
        io.emit('user_disconnected', session.user.id);
        io.emit('botMessage', time, session.user.name + " s'est déconnecté");
      });

    }
  });

};

module.exports = socket;