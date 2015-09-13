var express = require('express');
var async   = require('async');
var session = require('./session');
var flarum  = require('./flarum');

var router = express.Router();

router.get('/', function(req, res, next) {
  session.settings(req, res, { shouldBeLogged:false }, function( settings ) {
    settings.title += "Connexion";
    res.render('login', settings);
  });
});

router.post('/login', function(req, res, next) {
  session.settings(req, res, { shouldBeLogged:false }, function( settings ) {

    req.checkBody('username', "Valeur invalide").notEmpty();
    req.checkBody('password', "Valeur invalide").notEmpty();

    var errors = req.validationErrors( true );

    async.waterfall([
      // Vérification du formulaire
      function( callback ) {
        if( errors )
          callback("Veuillez saisir vos identifiants mondedie.fr - flarum");
        else
          callback();
      },
      // Authentification via l'API
      function( callback ) {
        flarum.login(req.body, next, function( user ) {
          if( user )
            callback( null, user );
          else
            callback("Identifiant ou mot de passe incorrect.");
        });
      },
      // Préparation de la session
      function( user, callback ) {
        flarum.user(user, next, function( userInfos ) {
          if( userInfos ) {
            req.session.user = {
              id:userInfos.data.id,
              name:userInfos.data.attributes.username,
              groupName:userInfos.included[0].attributes.namePlural,
              groupColor:userInfos.included[0].attributes.color
            };
            callback();
          } else {
            callback("Impossible d'initialiser la session utilisateur.");
          }
        });
      }
    ], function( err ) {
      if( err ) {
        settings.formMessage = err;
        return res.render('login', settings);
      } else {
        return res.redirect('/chatroom');
      }
    });
  });
});

router.get('/chatroom', function(req, res, next) {
  session.settings(req, res, { shouldBeLogged:true }, function( settings ) {
    settings.title += "Chatroom";
    res.render('chatroom', settings);
  });
});

module.exports = router;