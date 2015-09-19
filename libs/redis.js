var db = require('redis');
var redis  = {};

// Initialisation de la db redis
// Flush des utilisateurs connectés + initialisation du compteur de message
redis.init = function( callback ) {
  createClient(function( client ) {
    client.exists('messages:count', function( err, reply ) {
      if( reply !== 1 )
        client.set('messages:count', 0);
    });
    client.del('users');
    callback( client );
  });
};

// Connexion à la base de données Redis
redis.connect = function( callback ) {
  createClient(function( client ) {
    callback( client );
  });
};

// Création du client
var createClient = function( callback ) {
  var client = db.createClient( process.env.REDIS_URL );
  client.on('ready', function() {
    callback( client );
  });
};

module.exports = redis;