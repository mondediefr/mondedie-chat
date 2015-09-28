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

// Retourne la liste des messages
exports.list = function() {
  return redis.connect()
  .then(function(db) {
    return db.smembersAsync('messages:listed').call('sort', function(a, b) {
      a = a.replace('messages:list:', '');
      b = b.replace('messages:list:', '');
      return a - b;
    })
    .map(function(message, index) {
      if(index <= (MAX-1)) {
        return db.hgetallAsync(message)
        .then(function(message) {
          if(message.user) {
            return db.hgetallAsync('users:profiles:' + message.user)
            .then(function(user) {
              message.user = user;
              return message;
            })
          } else return message;
        });
      }
    }, { concurrency:200 })
    .then(function(messages) {
      db.quit();
      return messages;
    });
  });
};

 // Supprime un message
 exports.delete = function(id) {
   redis.connect(function (db) {
     db.del('messages:list:'+id);
     db.hdel('messages:listed', 'messages:list:'+id);
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

// Format un message à partir du profil utilisateur
var getFormatedMessage = function( db, i, callback ) {
  db.hgetall('messages:list:' + i, function( err, message ) {
    if( message.user ) {
      db.hgetall('users:profiles:' + message.user, function( err, user ) {
        message.user = user;
        callback( message );
      });
    } else callback( message );
  });
};
