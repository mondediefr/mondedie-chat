var async = require('async');
var redis = require("../libs/redis");

// Ajoute un utilisateurs à la liste des membres connectés
exports.add = function( user ) {
  redis.connect(function( db ) {
    var userkey = 'user:' + user.name;
    db.hmset( userkey, user );
    db.sadd('users', userkey);
    db.quit();
  });
};

// Retourne la liste des membres connectés
exports.list = function( callback ) {
  var list = [];
  redis.connect(function( db ) {
    getUsersKeys(function( users ) {
      async.each(users, function( user, nextUser ) {
        db.hgetall(user, function( err, userObj ) {
          list.push( userObj );
          nextUser();
        })
      }, function() {
        db.quit();
        callback( list );
      });
    });
  });
};

// Supprime un utilisateur de la liste des membres connectés
exports.remove = function( username ) {
  redis.connect(function( db ) {
    db.srem('users', 'user:' + username);
    db.quit();
  });
};

// Retourne la liste des clés associées aux utilisateurs
var getUsersKeys = function( callback ) {
  redis.connect(function( db ) {
    db.smembers('users', function( err, users ) {
      db.quit();
      callback( users );
    });
  });
};

/*

Ajout :
--------------------------------------------------
HMSET user:hardware {
  id	       2
  name	     Hardware
  groupName	 Admins
  groupColor #DF013A
  avatar	   http://flarum.mondedie.fr/...
}

SADD users user:hardware

HMSET user:hydrog3n {
  id	       3
  name	     Hydrog3n
  groupName	 Admins
  groupColor #DF013A
  avatar	   http://flarum.mondedie.fr/...
}

SADD users user:hydrog3n

Listing :
--------------------------------------------------
SMEMBERS users forEach {
  HGETALL user
}

Suppression :
--------------------------------------------------
SREM users user:hardware
SREM users user:hydrog3n

*/