var async = require('async');
var redis = require("../libs/redis");

// Ajoute un message dans le base de données
exports.add = function( time, user, message ) {
  redis.connect(function( db ) {
    getIncrementalCount(function( counter ) {
      if( ! user )
        db.set( 'message:' + counter, JSON.stringify({ time:time, message:message }));
      else
        db.set( 'message:' + counter, JSON.stringify({ time:time, user:user, message:message }));
      db.sadd('messages', counter);
      db.quit();
    });
  });
};

// Retourne la liste des messages
exports.list = function( callback ) {
  var list = [];
  redis.connect(function( db ) {
    getMessagesKeys(function( messages ) {
      async.eachSeries(messages, function( counter, next ) {
        db.get('message:' + counter, function( err, message ) {
          list.push(JSON.parse( message ));
          next();
        })
      }, function() {
        db.quit();
        callback( list );
      });
    });
  });
};

// Permet d'obtenir le nombre total de message avec incrémentation
var getIncrementalCount = function( callback ) {
  redis.connect(function( db ) {
    db.incr('messages:count', function( err, reply ) {
      db.quit();
      callback( reply );
    });
  });
};

// Retourne la liste des clés associées aux messages
var getMessagesKeys = function( callback ) {
  redis.connect(function( db ) {
    db.smembers('messages', function( err, messages ) {
      db.quit();
      // Retourne les 200 derniers messages
      callback(messages.sort( sortKeys ).slice( -200 ));
    });
  });
};

// Permet de trier les clés
var sortKeys = function( a, b ) {
  return a - b;
}