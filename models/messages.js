"use strict";
var Promise = require('bluebird');
// Nombre maximum de messages récupérés dans la base de données
var MAX = 200;

var Messages = function(redis) {
  this.db = redis;
}

/*
 * Ajoute un message dans le base de données
 */
Messages.prototype.add = function(time, username, message) {
  var self = this;
  return this.db.zcardAsync('messages:listed')
  .then(function(count) {
    var id = count + 1;
    var messagekey = 'messages:list:' + id;
    self.db.hmset(messagekey, {
      id:id,
      time:time,
      user:(username) ? username : null,
      message:message,
      deleted:false
    });
    self.db.zadd('messages:listed', id, messagekey);
    return id;
  }).finally(function(id) {
    return Promise.resolve(id);
  });
}

/*
 * Supprime un message (changement du flag 'deleted')
 */
Messages.prototype.del = function(message) {
  message.deleted = true;
  this.db.hmset('messages:list:' + message.id, message);
}

/*
 * Obtient les informations d'un message à partir de son id
 */
Messages.prototype.get = function(id) {
  return this.db.hgetallAsync('messages:list:' + id)
  .then(function(message) {
    return message ? message : Promise.reject('message not found');
  })
}

/*
 * Retourne les 200 derniers messages
 */
Messages.prototype.list = function() {
  var self = this;
  return this.db.zcardAsync('messages:listed')
  .then(function(total) {
    return self.db.zrangebyscoreAsync(['messages:listed', total - (MAX - 1), total])
  })
  .map(function(item) {
    return self.db.hgetallAsync(item);
  })
  .map(function(message) {
    if(!message.user) return message;
    return self.db.hgetallAsync('users:profiles:' + message.user.toLowerCase())
    .then(function(user) {
      message.user = user;
      return message;
    });
  })
  .finally(function(messages) {
    return messages;
  });
}

module.exports = Messages;