var socket = {};

var debug    = require('debug')('socket')
var moment   = require('moment-timezone');
var async    = require('async');
var marked   = require('marked');

var users    = require('../models/users.js');
var messages = require('../models/messages.js');

marked.setOptions({
  tables: false,
  sanitize: true
});

// Ping du client toutes les 50 secondes pour éviter
// un drop de la connexion par Heroku au bout de 55
// secondes ( erreur H15 )
var heartbeatInterval = 50000;

socket.init = function( io ) {

  function sendHeartbeat() {
    setTimeout( sendHeartbeat, heartbeatInterval );
    io.emit('ping', { beat : 1 });
  }

  io.on('connection', function( socket ) {

    var session = socket.handshake.session;
    var dateFormat = 'DD/MM à HH:mm:ss'
    var time = moment().tz('Europe/Paris').format( dateFormat );

    // TODO: Utiliser les promises pour éviter une piramide de doom (callback hell)
    if( session.user ) {
      session.user.socket = socket.id;
      users.exist(session.user.name, function( exist ) {
        if( ! exist ) {
          users.banned(session.user.name, function( isBanned ) {
            if( ! isBanned ) {
              users.add( session.user );
              users.list(function( usersList ) {
                // On previent les autres utilisateurs qu'un membre vient de se connecter
                io.emit('user_new');
                addBotMessage(io, time, session.user.name + " s'est connecté");
                async.eachSeries(usersList, function( user, next ) {
                  io.emit('user_connected', user);
                  next();
                }, function() {
                  // Réception la réponse (pong) du client
                  socket.on('pong', function( data ) {
                    debug('Pong received from client');
                  });
                  // Réception d'un message
                  socket.on('message', function( message ) {
                    time = moment().tz('Europe/Paris').format( dateFormat );
                    if( message && message.length <= 1000 )
                      addMessage(io, time, session.user, marked( message ));
                  });
                  // Déconnexion de l'utilisateur
                  socket.on('disconnect', function() {
                    users.remove( session.user.name );
                    time = moment().tz('Europe/Paris').format( dateFormat );
                    io.emit('user_disconnected', session.user.id);
                    addBotMessage(io, time, session.user.name + " s'est déconnecté");
                  });
                  // Ban d'un utilisateur par un admin
                  socket.on('ban', function( username ) {
                    if( session.user.isAdmin ) {
                      users.getUserSocket( username, function( userSocket ) {
                        if( userSocket ) {
                          users.ban( username );
                          io.to( userSocket ).emit('ban');
                          time = moment().tz('Europe/Paris').format( dateFormat );
                          addBotMessage(io, time, username + " a été kick du chat");
                        } else {
                          io.to( socket.id ).emit('user_notfound');
                        }
                      });
                    }
                  });
                  // Deban d'un utilisateur
                  socket.on('unban', function( username ) {
                    if( session.user.isAdmin ) {
                      users.unban( username );
                      time = moment().tz('Europe/Paris').format( dateFormat );
                      addBotMessage(io, time, " Une seconde chance a été offerte à " + username);
                    }
                  });
                });
              });
            } else {
              io.to( socket.id ).emit('user_banned');
            }
          });
        } else {
          io.to( socket.id ).emit('already_connected');
        }
      });
    }
  });
  // Envoi du premier Heartbeat
  setTimeout( sendHeartbeat, heartbeatInterval );
};

var addMessage = function( io, time, user, message ) {
  messages.add( time, user.name, message );
  io.emit('message', time, user, message);
};

var addBotMessage = function( io, time, message ) {
  messages.add( time, null, message );
  io.emit('botMessage', time, message);
};

module.exports = socket;