var socket = {};

var moment   = require('moment');
var async    = require('async');
var entities = require("entities");

var users = require('../models/users.js');

socket.init = function( io ) {
  io.on('connection', function( socket ) {

    var session = socket.handshake.session;
    var dateFormat = 'DD/MM à HH:mm:ss'
    var time = moment().format( dateFormat );

    if( session.user ) {
      users.add( session.user );
      users.list(function( usersList ) {
        // On previent les autres utilisateurs qu'un membre vient de se connecter
        io.emit('user_new');
        io.emit('botMessage', time, session.user.name + " s'est connecté");
        async.eachSeries(usersList, function( user, next ) {
          io.emit('user_connected', user);
          next();
        }, function() {
          // Réception d'un message
          socket.on('message', function( message ) {
            time = moment().format( dateFormat );
            io.emit('message', time, session.user, entities.encodeHTML( message ));
          });
          // Déconnexion de l'utilisateur
          socket.on('disconnect', function() {
            users.remove( session.user.name );
            time = moment().format( dateFormat );
            io.emit('user_disconnected', session.user.id);
            io.emit('botMessage', time, session.user.name + " s'est déconnecté");
          });
        });
      });
    }
  });
};

module.exports = socket;