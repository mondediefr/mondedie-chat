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
      messages.add(time, null, session.user.name + " s'est connecté");
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
        messages.add(time, null, session.user.name + " s'est déconnecté");
      });
      // Ban d'un utilisateur par un admin
      socket.on('ban', function(username) {
        if(session.user.isAdmin) {
          users.getUserSocket(username)
          .then(function(userSocket) {
            users.ban(username);
            io.to(userSocket).emit('ban');
            time = moment().tz('Europe/Paris').format(dateFormat);
            addBotMessage(io, time, username + " a été kick du chat");
          }).catch(function() {
            io.to(socket.id).emit('user_notfound');
          });
        }
      });
      // Deban d'un utilisateur
      socket.on('unban', function(username) {
        if(session.user.isAdmin) {
          users.unban(username);
          time = moment().tz('Europe/Paris').format(dateFormat);
          addBotMessage(io, time, " Une seconde chance a été offerte à " + username);
        }
      });
    }).catch(AlreadyConnectedError, function() {
      io.to(socket.id).emit('already_connected');
    }).catch(UserBannedError, function() {
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