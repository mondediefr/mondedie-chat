var socket = {};

var moment   = require('moment-timezone');
var async    = require('async');
var entities = require("entities");

var users    = require('../models/users.js');
var messages = require('../models/messages.js');

socket.init = function( io ) {
  io.on('connection', function( socket ) {

    var session = socket.handshake.session;
    var dateFormat = 'DD/MM à HH:mm:ss'
    var time = moment().tz('Europe/Paris').format( dateFormat );

    if( session.user ) {
      users.exist(session.user.name, function( exist ) {
        if( ! exist ) {
          users.add( session.user );
          users.list(function( usersList ) {
            // On previent les autres utilisateurs qu'un membre vient de se connecter
            io.emit('user_new');
            addBotMessage(io, time, session.user.name + " s'est connecté");
            async.eachSeries(usersList, function( user, next ) {
              io.emit('user_connected', user);
              next();
            }, function() {
              // Réception d'un message
              socket.on('message', function( message ) {
                time = moment().tz('Europe/Paris').format( dateFormat );
                addMessage(io, time, session.user, message);
              });
              // Déconnexion de l'utilisateur
              socket.on('disconnect', function() {
                users.remove( session.user.name );
                time = moment().tz('Europe/Paris').format( dateFormat );
                io.emit('user_disconnected', session.user.id);
                addBotMessage(io, time, session.user.name + " s'est déconnecté");
              });
            });
          });
        } else {
          io.to( socket.id ).emit('already_connected');
        }
      });
    }
  });
};

var addMessage = function( io, time, user, message ) {
  messages.add( time, user, message );
  io.emit('message', time, user, entities.encodeHTML( message ));
};

var addBotMessage = function( io, time, message ) {
  messages.add( time, null, message );
  io.emit('botMessage', time, message);
};

module.exports = socket;