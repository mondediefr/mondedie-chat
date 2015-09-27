var Promise = require('bluebird');
var redis   = require("../libs/redis");

// Ajoute un utilisateur à la liste des membres connectés
exports.add = function( user ) {
  redis.connect().then(function( db ) {
    var userkey = 'users:profiles:' + user.name;
    db.hmset( userkey, user );
    db.sadd('users:connected', userkey);
    db.quit();
  });
};

// Ajoute un utilisateur à la liste des membres bannis
exports.ban = function( username ) {
  redis.connect().then(function( db ) {
    db.sadd('users:banned', 'users:profiles:' + username);
    db.quit();
  });
};

// Supprime un utilisateur de la liste des membres bannis
exports.unban = function( username ) {
  redis.connect().then(function( db ) {
    db.srem('users:banned', 'users:profiles:' + username);
    db.quit();
  });
};

// Retourne la liste des membres connectés
exports.list = function() {
  return list('users:connected');
};

// Supprime un utilisateur de la liste des membres connectés
exports.remove = function( username ) {
  redis.connect().then(function( db ) {
    db.srem('users:connected', 'users:profiles:' + username);
    db.quit();
  });
};

// Vérifie si l'utilisateur est déjà connecté
exports.exist = function( username ) {
  var exist = false;
  return list('users:connected').map(function( user ) {
    if( user.name == username )
      exist = true;
  }).then(function() {
    return Promise.resolve( exist );
  });
};

// Récupère l'identificateur du socket de l'utilisateur
exports.getUserSocket = function( username ) {
  return redis.connect()
  .then(function( db ) {
    return db.hgetallAsync('users:profiles:' + username)
    .then(function( user ) {
      db.quit();
      return user ? user.socket : Promise.reject();
    });
  });
};

// Vérifie si l'utilisateur est banni
exports.banned = function( username ) {
  var exist = false;
  return list('users:banned').map(function( user ) {
    if( user.name == username )
      exist = true;
  }).then(function() {
    return Promise.resolve( exist );
  });
};

// Retourne une liste d'utilisateurs sous forme d'objet
var list = function( key ) {
  return redis.connect()
  .then(function( db ) {
    return db.smembersAsync( key )
    .map(function( user ) {
      return db.hgetallAsync( user ) })
    .then(function( users ) {
      db.quit();
      return users;
    });
  });
};