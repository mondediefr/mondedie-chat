"use strict";
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
      time:time,
      user:(username) ? username : null,
      message:message,
      id:id
    });
    self.db.zadd('messages:listed', id, messagekey)
  });
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