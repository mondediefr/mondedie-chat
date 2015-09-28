var express = require('express');
var Promise = require('bluebird');

var session = require('../libs/session');
var flarum  = require('../libs/flarum');

var users    = require('../models/users');
var messages = require('../models/messages');

var router = express.Router();

router.get('/', function(req, res, next) {
  session.settings(req, res, { shouldBeLogged:false }, function(settings) {
    settings.title += "Connexion";
    res.render('login', settings);
  });
});

router.post('/login', function(req, res, next) {
  session.settings(req, res, { shouldBeLogged:false }, function(settings) {

    req.checkBody('username', "Valeur invalide").notEmpty();
    req.checkBody('password', "Valeur invalide").notEmpty();

    if(req.validationErrors(true)) {
      settings.formMessage = 'Veuillez saisir vos identifiants mondedie.fr - flarum';
      return res.render('login', settings);
    }

    return flarum.login(req.body)
    .then(function(user) {
      return flarum.user(user)
    })
    .then(function(userInfos) {
      req.session.user = {
        id:userInfos.data.id,
        name:userInfos.data.attributes.username,
        groupName:(userInfos.included) ? userInfos.included[0].attributes.namePlural : null,
        groupColor:(userInfos.included) ? userInfos.included[0].attributes.color : null,
        avatar:(userInfos.data.attributes.avatarUrl) ? userInfos.data.attributes.avatarUrl : process.env.APP_URL + 'images/avatar.png'
      }
    })
    .then(function() {
      return users.exist(req.session.user.name)
      .then(function(exist) {
        if(exist)
          return Promise.reject('Vous êtes déjà connecté au chat.');
      });
    })
    .then(function() {
      return users.banned(req.session.user.name)
      .then(function(isBanned) {
        if(isBanned)
          return Promise.reject('Impossible de se connecter au chat, vous avez été banni.');
      });
    })
    .then(function() {
      return res.redirect('/chatroom');
    })
    .catch(function(err) {
      req.session.destroy(function() {
        settings.formMessage = err;
        return res.render('login', settings);
      });
    });

  });
});

router.get('/chatroom', function(req, res, next) {
  session.settings(req, res, { shouldBeLogged:true }, function(settings) {
    settings.title += "Chatroom";
    settings.user = req.session.user;
    res.render('chatroom', settings);
  });
});

router.get('/get/messages', function(req, res, next) {
  session.settings(req, res, { shouldBeLogged:true }, function(settings) {
    messages.list().then(function(list) {
      res.json({ messages:list });
    });
  });
});

router.get('/logout', function(req, res, next) {
  session.settings(req, res, { shouldBeLogged:true }, function(settings) {
    req.session.destroy(function() {
      return res.redirect('/');
    });
  });
});

router.get('/del/message/:id', function(req, res, next) {
  session.settings(req, res, { shouldBeLogged:true }, function(settings) {
    messages.delete(req.param.id);
  });
});

module.exports = router;