var socket = {};

var moment   = require('moment');
var async    = require('async');
var entities = require("entities");

socket.init = function( io ) {

  var users = [];

  io.on('connection', function( socket ) {

    var session = socket.handshake.session;
    var dateFormat = 'DD/MM à HH:mm:ss'
    var time = moment().format( dateFormat );

    if( session.user ) {

      console.log( session.user );

      if( ! session.user.connected ) {

        socket.handshake.session.user.connected = true;
        users.push( session.user );

        io.emit('user_new');
        io.emit('user_connected', session.user);
        io.emit('botMessage', time, session.user.name + " s'est connecté");

      }

      async.eachSeries(users, function( user, nextUser ) {

        if( user.name != session.user.name ) {
          io.emit('user_connected', user);
        }

        nextUser();

      }, function( err ) {

        socket.on('message', function( message ) {
          time = moment().format( dateFormat );
          io.emit('message', time, session.user, entities.encodeHTML(message));
        });

        socket.on('disconnect', function() {
          socket.handshake.session.user.connected = false;
          users.slice(users.indexOf(session.user), 1);
          time = moment().format( dateFormat );
          io.emit('user_disconnected', session.user.id);
          io.emit('botMessage', time, session.user.name + " s'est déconnecté");
        });

      });

    }

  });

};

module.exports = socket;