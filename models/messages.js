var async = require('async');
var redis = require("../libs/redis");

// Nombre maximum de messages récupérés dans la base de données
var MAX = 200;

// Ajoute un message dans le base de données
exports.add = function( time, username, message ) {
  redis.connect(function( db ) {
    getIncrementalCount(function( nb ) {
      if( ! username )
        db.hmset('messages:list:' + nb, { time:time, message:message });
      else
        db.hmset('messages:list:' + nb, { time:time, user:username, message:message });
      db.quit();
    });
  });
};

// Retourne la liste des messages
exports.list = function( callback ) {
  var list = [];
  var listed = 0;
  redis.connect(function( db ) {
    db.get('messages:count', function( err, nb ) {
      var min = ((nb - MAX) > 0) ? (nb - MAX) : 1 ;
      for( var i = min; i <= nb; i++ ) {
        /* jshint loopfunc: true */
        getFormatedMessage(db, i, function( message ) {
          list.push( message );
          if(++listed == ( nb - min )) {
            db.quit();
            callback( list );
          }
        });
      }
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

// Format un message à partir du profil utilisateur
var getFormatedMessage = function( db, i, callback ) {
  db.hgetall('messages:list:' + i, function( err, message ) {
    db.hgetall('users:profiles:' + message.user, function( err, user ) {
      message.user = user;
      callback( message );
    });
  });
};