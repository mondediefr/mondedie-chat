var db = require('redis');
var redis  = {};

// Initialisation de la db redis ( Flush des utilisateurs connectés )
redis.init = function() {
  createClient(function( client ) {
    client.del('users');
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