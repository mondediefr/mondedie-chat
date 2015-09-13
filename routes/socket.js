var socket = {};

var moment   = require('moment');
var async    = require('async');
var entities = require("entities");

// Tableau contenant la liste des utilisateurs connectés
// Solution provisoire, à remplacer par redis pour un stockage
// plus souple et performant
var users = [];

socket.init = function( io ) {
  io.on('connection', function( socket ) {

    var session = socket.handshake.session;
    var dateFormat = 'DD/MM à HH:mm:ss'
    var time = moment().format( dateFormat );

    if( session.user ) {
      // Ajout de l'utilisateur à la liste des participants
      users.push( session.user );
      sortUsersByName( users );

      // On previent les autres utilisateurs qu'un membre vient de se connecter
      io.emit('user_new');
      io.emit('botMessage', time, session.user.name + " s'est connecté");

      async.eachSeries(users, function( user, next ) {
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
          removeUser( session.user.id );
          time = moment().format( dateFormat );
          io.emit('user_disconnected', session.user.id);
          io.emit('botMessage', time, session.user.name + " s'est déconnecté");
        });
      });
    }

  });
};

// Trie la liste des utilisateurs par ordre alphabétique
var sortUsersByName = function( users ) {
  users.sort(function( x, y ) {
    var a = x.name;
    var b = y.name;
    return ( a < b ) ? -1 : ( a > b ) ? 1 : 0;
  });
};

// Supprime un utilisateur via son identifiant
var removeUser = function( userid ) {
  for( var i = 0; i < users.length; i++ ) {
    if( users[i].id == userid )
      users.splice(i, 1);
  }
};

module.exports = socket;