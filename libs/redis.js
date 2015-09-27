var Promise = require('bluebird');
var db      = require('redis');
var redis   = {};

Promise.promisifyAll( db.RedisClient.prototype );

// Initialisation de la db redis
// Flush des utilisateurs connectés + initialisation du compteur de message
redis.init = function() {
  return createClient().then(function( client ) {
    client.existsAsync('messages:count').then(function( reply ) {
      if( reply !== 1 )
        client.set('messages:count', 0);
      client.del('users:connected');
      return client;
    });
  });
};

// Connexion à la base de données Redis
redis.connect = function() {
  return createClient();
};

// Création du client
var createClient = function() {
  var client = db.createClient( process.env.REDIS_URL );
  return client.onAsync('ready')
  .then(function() {
    return Promise.resolve( client );
  });
};

module.exports = redis;