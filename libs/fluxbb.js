"use strict";
var Promise = require('bluebird');
var request = Promise.promisifyAll(require("request"));
var fluxbb = {};

/*
 *  Récupère les informations de l'utilisateur auprès de l'API
 */
fluxbb.login = function(data) {
  return request.postAsync({
    uri:process.env.FLUXBB_API_ENDPOINT + 'auth.php',
    form:{ login:data.username, password:data.password }
  }).then(function(response) {
    return response.statusCode === 200 ? response.body : Promise.reject();
  }).then(JSON.parse).then(function(userInfos) {
    return userInfos ? userInfos : Promise.reject();
  }).catch(function() {
    return Promise.reject('Identifiant ou mot de passe incorrect.');
  });
};

module.exports = fluxbb;