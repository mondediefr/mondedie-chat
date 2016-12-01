"use strict";
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var auth = {};

/* Récupère les informations de l'utilisateur auprès de l'API */

/* FLARUM AUTH */
auth.login = function(data) {
  return request.postAsync({
    uri: process.env.FLARUM_API_ENDPOINT + 'token',
    form: {
      identification: data.username,
      password: data.password
    }
  }).then(function(response) {
    return response.statusCode === 200 ? response.body : Promise.reject();
  }).then(JSON.parse).then(function(authData) {
    return authData.token ? authData : Promise.reject();
  }).catch(function() {
    return Promise.reject('Identifiant ou mot de passe incorrect.');
  });
};

auth.user = function(user) {
  return request.getAsync({
    uri: process.env.FLARUM_API_ENDPOINT + 'users/' + user.userId,
    headers: {
      'Authentication': 'Token ' + user.token
    }
  }).then(function(response) {
    return response.statusCode === 200 ? response.body : Promise.reject();
  }).then(JSON.parse).then(function(userInfos) {
    return userInfos.data ? userInfos : Promise.reject();
  }).catch(function() {
    return Promise.reject('Impossible de récupérer les informations de l\'utilisateur.');
  });
};

module.exports = auth;
