var Promise = require('bluebird');
var db      = require('redis');
var redis   = {};

Promise.promisifyAll(db.RedisClient.prototype);

// Initialisation de la db redis
// Flush des utilisateurs connectés + initialisation du compteur de message
redis.init = function(callback) {
  var client = db.createClient(process.env.REDIS_URL);
  return client.onAsync('ready')
  .then(function() {
    return client.existsAsync('messages:count')
  }).then(function(reply) {
    if(reply !== 1)
      client.set('messages:count', 0);
    client.del('users:connected');
  }).then(function() {
    return Promise.resolve(client);
  });
};

// Connexion à la base de données Redis
redis.connect = function() {
  var client = db.createClient(process.env.REDIS_URL);
  return client.onAsync('ready')
  .then(function() {
    return Promise.resolve(client);
  });
};

module.exports = redis;