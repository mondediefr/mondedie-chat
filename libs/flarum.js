var request = require('request');
var flarum = {};

/*
 *  Récupère les informations d'identification auprès de l'API
 */
flarum.login = function( data, next, callback ) {
  request({
    uri:process.env.FLARUM_API_ENDPOINT + 'token',
    method:'POST',
    form:{
      identification:data.username,
      password:data.password
    }
  }, function( err, response, body ) {
    if( err || response.statusCode != 200 )
      return callback( false );
    var authData = JSON.parse( body );
    callback( authData );
  });
};

/*
 *  Récupère les informations de l'utilisateur
 */
flarum.user = function( user, next, callback ) {
  request({
    uri:process.env.FLARUM_API_ENDPOINT + 'users/' + user.userId,
    method:'GET',
    headers: {
      'Authentication': 'Token ' + user.token,
    }
  }, function( err, response, body ) {
    if( err || response.statusCode != 200 )
      return callback( false );
    var userInfos = JSON.parse( body );
    callback( userInfos );
  });
};

module.exports = flarum;