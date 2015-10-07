var Promise = require('bluebird');
var redis   = require("../libs/redis");

// Nombre maximum de messages récupérés dans la base de données
var MAX = 200;

// Ajoute un message dans le base de données
exports.add = function(time, username, message) {
  redis.connect()
  .then(function(db) {
    getIncrementalCount()
    .then(function(nb) {
      var messagekey = 'messages:list:' + nb;
      db.hmset(messagekey, {time:time, user:(username) ? username : null, message:message, id:nb});
      db.sadd('messages:listed', messagekey);
      db.quit();
    });
  });
};

/*
 * Retourne les 200 derniers messages
 *
 * - La méthode call appel la fonction de trie des messages
 *
 * - La méthode filter permet de retirer les messages trop anciens
 *
 * - La méthode map traite chaque message en allant chercher
 *   ses propriétés (time, user, message) dans redis via hgetall
 *   L'objet message.user est lui aussi complété avec les propriétés
 *   du profil de l'utilisateur (users:profiles:username)
 *   Si la propriété user est nulle, alors il s'agit d'un message
 *   du bot, donc on renvoie un objet message sans utilisateur.
 */
exports.list = function() {
  return redis.connect()
  .then(function(db) {
    return db.getAsync('messages:count')
    .then(function(count) {
      return db.smembersAsync('messages:listed').call('sort', sort)
      .filter(function(item, index) {
        return index >= (count - MAX);
      })
      .map(function(item) {
        return db.hgetallAsync(item)
        .then(function(message) {
          if(message.user) {
            return db.hgetallAsync('users:profiles:' + message.user)
            .then(function(user) {
              message.user = user;
              return message;
            })
          } else return message;
        });
      }, { concurrency:200 })
      .then(function(messages) {
        db.quit();
        return messages;
      });
    });
  });
};

// Supprime un message
exports.delete = function(id) {
  return redis.connect()
  .then(function(db) {
    db.delAsync('messages:list:' + id)
    .then(function() {
      db.sremAsync('messages:listed', 'messages:list:' + id) })
  }).then(function() {
    return Promise.resolve();
  });
};

// Permet d'obtenir le nombre total de message avec incrémentation
var getIncrementalCount = function() {
  return redis.connect()
  .then(function(db) {
    return db.incrAsync('messages:count')
    .then(function(reply) {
      db.quit();
      return reply;
    });
  });
};

/*
 * Trie des messages par id
 *
 * Les clés se composent comme ceci :
 * messages:list:id
 * Donc pour effectuer un trie par différence
 * numérique il faut supprimer tout ce qui
 * se trouve avant l'identifiant
 */
var sort = function(a, b) {
  a = a.substring(14);
  b = b.substring(14);
  return a - b;
};