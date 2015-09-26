var async = require('async');
var redis = require("../libs/redis");

// Ajoute un utilisateur à la liste des membres connectés
exports.add = function( user ) {
  redis.connect(function( db ) {
    var userkey = 'users:profiles:' + user.name;
    db.hmset( userkey, user );
    db.sadd('users:connected', userkey);
    db.quit();
  });
};

// Ajoute un utilisateur à la liste des membres bannis
exports.ban = function( username ) {
  redis.connect(function( db ) {
    db.sadd('users:banned', 'users:profiles:' + username);
    db.quit();
  });
};

// Supprime un utilisateur de la liste des membres bannis
exports.unban = function( username ) {
  redis.connect(function( db ) {
    db.srem('users:banned', 'users:profiles:' + username);
    db.quit();
  });
};

// Retourne la liste des membres connectés
exports.list = function( callback ) {
  list('users:connected', function( users ) {
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
  list('users:connected', function( users ) {
    async.each(users, function( user, nextUser ) {
      if( user.name == username )
        exist = true;
      nextUser();
    }, function() {
      callback( exist );
    });
  });
};

// Récupère l'identificateur du socket de l'utilisateur
exports.getUserSocket = function( username, callback ) {
  redis.connect(function( db ) {
    db.hgetall('users:profiles:' + username, function( err, user ) {
      if( user )
        callback( user.socket );
      else
        callback( null );
    });
  });
};

// Vérifie si l'utilisateur est banni
exports.banned = function( username, callback ) {
  var exist = false;
  list('users:banned', function( users ) {
    async.each(users, function( user, nextUser ) {
      if( user.name == username )
        exist = true;
      nextUser();
    }, function() {
      callback( exist );
    });
  });
};

// Retourne une liste d'utilisateurs sous forme d'objet
var list = function( key, callback ) {
  var list = [];
  redis.connect(function( db ) {
    db.smembers(key, function( err, users ) {
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