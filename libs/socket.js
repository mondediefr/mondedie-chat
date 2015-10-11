"use strict";
var socket = {};

var Promise  = require('bluebird');
var debug    = require('debug')('socket')
var moment   = require('moment-timezone');
var marked   = require('marked');
var emojione = require('emojione');

var redis    = require('../libs/redis')();
var Smileys  = require('../libs/smileys');
var Users    = require('../models/users.js');
var Messages = require('../models/messages.js');

var users    = new Users(redis.client);
var messages = new Messages(redis.client);
var smileys  = new Smileys();

emojione.ascii = true;

marked.setOptions({
  tables: false,
  sanitize: true,
  highlight: function(code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

var renderer = new marked.Renderer();

renderer.link = function(href, title, text) {
  return '<a target="_blank" href="'+ href +'">' + text + '</a>'
}

renderer.paragraph = function(text) {
  return smileys.replace(emojione.shortnameToImage(text));
}

// Ping du client toutes les 50 secondes pour éviter
// un drop de la connexion par Heroku au bout de 55
// secondes (erreur H15)
var heartbeatInterval = 50000;

socket.init = function(io) {

  function sendHeartbeat() {
    setTimeout(sendHeartbeat, heartbeatInterval);
    io.emit('ping', { beat : 1 });
  }

  io.on('connection', function(socket) {

    var session = socket.handshake.session;
    var dateFormat = 'DD/MM à HH:mm:ss'
    var time = moment().tz('Europe/Paris').format(dateFormat);

    if( ! session.user )
      return;

    session.user.socket = socket.id;

    return users.exist(session.user.name)
    .then(function(exist) {
      if(exist) throw new AlreadyConnectedError();
      else return Promise.resolve()
    })
    .then(function() {
      return users.banned(session.user.name).then(function(isBanned) {
        if(isBanned) throw new UserBannedError();
        else return Promise.resolve();
      });
    })
    .then(function() {
      users.add(session.user);
      io.emit('user_new', time, session.user.name);
      users.list().map(function(user) {
        io.emit('user_connected', user);
      });
    })
    .then(function() {
      // Réception la réponse (pong) du client
      socket.on('pong', function(data) {
        debug('Pong received from client');
      });
      // Réception d'un message
      socket.on('message', function(message) {
        time = moment().tz('Europe/Paris').format(dateFormat);
        if(message && message.length <= 1000)
          addMessage(io, time, session.user, marked(message, { renderer:renderer }));
      });
      // Déconnexion de l'utilisateur
      socket.on('disconnect', function() {
        users.remove(session.user.name);
        time = moment().tz('Europe/Paris').format(dateFormat);
        io.emit('user_disconnected', time, session.user);
      });
      // Ban d'un utilisateur par un admin
      socket.on('ban', function(username) {
        if(!session.user.isAdmin || username.toLowerCase() == session.user.name.toLowerCase())
          return;
        users.getUserSocket(username)
        .then(function(userSocket) {
          users.ban(username);
          io.to(userSocket).emit('ban');
          time = moment().tz('Europe/Paris').format(dateFormat);
          addBotMessage(io, time, username + " a été kick du chat");
        })
        .catch(function() {
          time = moment().tz('Europe/Paris').format(dateFormat);
          io.to(socket.id).emit('botMessage', time, 'Utilisateur introuvable...');
        });
      });
      // Deban d'un utilisateur
      socket.on('unban', function(username) {
        if(!session.user.isAdmin)
          return;
        users.unban(username);
        time = moment().tz('Europe/Paris').format(dateFormat);
        addBotMessage(io, time, " Une seconde chance a été offerte à " + username);
      });
      // Utilisateur est AFK
      socket.on('afk', function() {
        session.user.status = 'afk';
        users.add(session.user);
        time = moment().tz('Europe/Paris').format(dateFormat);
        io.emit('user_afk', time, session.user.name);
      });
      // Utilisateur n'est plus AFK
      socket.on('unafk', function() {
        session.user.status = 'online';
        users.add(session.user);
        time = moment().tz('Europe/Paris').format(dateFormat);
        io.emit('user_unafk', time, session.user.name);
      });
      // Messages privés
      socket.on('private_message', function(username, message) {
        if(username.toLowerCase() == session.user.name.toLowerCase()) {
          io.to(socket.id).emit('botMessage', time, 'WTF, il se parle à lui même oO ...');
          return;
        }
        users.getUserSocket(username)
        .then(function(userSocket) {
          time = moment().tz('Europe/Paris').format(dateFormat);
          if(message && message.length <= 1000) {
            var marksrc  = marked('*(chuchotte à **' + username + '**)* ' + message, { renderer:renderer });
            var markdest = marked('*(murmure)* ' + message, { renderer:renderer });
            io.to(socket.id).emit('message', time, session.user, marksrc);
            io.to(userSocket).emit('message', time, session.user, markdest);
          }
        })
        .catch(function() {
          time = moment().tz('Europe/Paris').format(dateFormat);
          io.to(socket.id).emit('botMessage', time, 'Utilisateur introuvable, transmission du message impossible...');
        });
      });
    })
    .catch(AlreadyConnectedError, function() {
      io.to(socket.id).emit('already_connected');
    })
    .catch(UserBannedError, function() {
      io.to(socket.id).emit('user_banned');
    });
  });
  // Envoi du premier Heartbeat
  setTimeout(sendHeartbeat, heartbeatInterval);
};

var addMessage = function(io, time, user, message) {
  messages.add(time, user.name, message);
  io.emit('message', time, user, message);
};

var addBotMessage = function(io, time, message) {
  messages.add(time, null, message);
  io.emit('botMessage', time, message);
};

// Déclaration des erreurs
function AlreadyConnectedError() {}
function UserBannedError() {}

// Déclaration des prototypes
AlreadyConnectedError.prototype = Object.create(Error.prototype);
UserBannedError.prototype = Object.create(Error.prototype);

module.exports = socket;