var async = require('async');
var redis = require("../libs/redis");

// Ajoute un utilisateurs à la liste des membres connectés
exports.add = function( user ) {
  redis.connect(function( db ) {
    var userkey = 'users:profiles:' + user.name;
    db.hmset( userkey, user );
    db.sadd('users:connected', userkey);
    db.quit();
  });
};

// Retourne la liste des membres connectés
exports.list = function( callback ) {
  usersList(function( users ) {
    callback( users );
  });
};

// Supprime un utilisateur de la liste des membres connectés
exports.remove = function( username ) {
  redis.connect(function( db ) {
    db.srem('users:connected', 'users:profiles:' + username);
    db.quit();
  });
};

// Vérifie si l'utilisateur est déjà connecté
exports.exist = function( username, callback ) {
  var exist = false;
  usersList(function( users ) {
    async.each(users, function( user, nextUser ) {
      if(user.name == username)
        exist = true;
      nextUser();
    }, function() {
      callback( exist );
    });
  });
};

// Retourne la liste des utilisateur sous forme d'objet
var usersList = function( callback ) {
  var list = [];
  redis.connect(function( db ) {
    db.smembers('users:connected', function( err, users ) {
      async.eachSeries(users, function( user, nextUser ) {
        db.hgetall(user, function( err, obj ) {
          list.push( obj );
          nextUser();
        });
      }, function() {
        db.quit();
        callback( list );
      });
    });
  });
};