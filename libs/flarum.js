"use strict";
var Promise = require('bluebird');
var request = Promise.promisifyAll(require("request"));
var flarum = {};

/*
 *  Récupère les informations d'identification auprès de l'API
 */
flarum.login = function(data) {
  return request.postAsync({
    uri:process.env.FLARUM_API_ENDPOINT + 'token',
    form:{ identification:data.username, password:data.password }
  }).get(1).then(JSON.parse).then(function(authData) {
    return authData.token ? authData : Promise.reject();
  }).catch(function() {
    return Promise.reject('Indentifiant ou mot de passe incorrect.');
  });
};

/*
 *  Récupère les informations de l'utilisateur
 */
flarum.user = function(user) {
  return request.getAsync({
    uri:process.env.FLARUM_API_ENDPOINT + 'users/' + user.userId,
    headers: { 'Authentication': 'Token ' + user.token }
  }).get(1).then(JSON.parse).then(function(userInfos) {
    return userInfos.data ? userInfos : Promise.reject();
  }).catch(function() {
    return Promise.reject('Impossible de récupérer les informations de l\'utilisateur.');
  });
};

module.exports = flarum;