"use strict";
var express  = require('express');
var Promise  = require('bluebird');

var session  = require('../libs/session');
var auth     = require('../libs/auth');
var redis    = require('../libs/redis')();

var Messages = require('../models/messages');
var Users    = require('../models/users');

var router   = express.Router();
var users    = new Users(redis.client);
var messages = new Messages(redis.client);

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
      settings.formMessage = 'Veuillez saisir vos identifiants mondedie.fr';
      return res.render('login', settings);
    }

    /* CUSTOM FLUXBB AUTH */
    return auth.login(req.body)
    .then(function(userInfos) {
      req.session.user = {
        id:userInfos.data.id,
        name:userInfos.data.attributes.username,
        groupName:(userInfos.included) ? userInfos.included.attributes.namePlural : null,
        groupColor:(userInfos.included) ? userInfos.included.attributes.color : "#333",
        avatar:(userInfos.data.attributes.avatarUrl) ? userInfos.data.attributes.avatarUrl : '/images/avatar.jpeg',
        status:'online'
      }
    })
    /*
    AUTH FLARUM
    return flarum.login(req.body)
    .then(function(user) {
      return flarum.user(user)
    })
    .then(function(userInfos) {
      req.session.user = {
        id:userInfos.data.id,
        name:userInfos.data.attributes.username,
        groupName:(userInfos.included) ? userInfos.included[0].attributes.namePlural : null,
        groupColor:(userInfos.included) ? userInfos.included[0].attributes.color : "#333",
        avatar:(userInfos.data.attributes.avatarUrl) ? userInfos.data.attributes.avatarUrl : process.env.APP_URL + 'images/avatar.jpeg',
        status:'online'
      }
    })
    */
    .then(function() {
      return users.exist(req.session.user.name)
      .then(function(exist) {
        return exist ? Promise.reject('Vous êtes déjà connecté au chat.') : Promise.resolve();
      });
    })
    .then(function() {
      return users.banned(req.session.user.name)
      .then(function(isBanned) {
        return isBanned ? Promise.reject('Impossible de se connecter au chat, vous avez été banni.') : Promise.resolve();
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
    if(process.env.ANALYTIC_KEY)
      settings.analytics = process.env.ANALYTIC_KEY;
    return res.render('chatroom', settings);
  });
});

router.get('/get/messages', function(req, res, next) {
  session.settings(req, res, { shouldBeLogged:true }, function(settings) {
    messages.list().then(function(list) {
      return res.json({ messages:list });
    });
  });
});

router.delete('/delete/message', function(req, res, next) {
  session.settings(req, res, { shouldBeLogged:true }, function(settings) {
    messages.get(req.body.id).then(function(message) {
      if(message.deleted === 'true')
        return Promise.reject('Message not found');
      if(!req.session.user.isAdmin && message.user !== req.session.user.name)
        return Promise.reject('Not authorized');
      return message;
    })
    .then(function(message) {
      messages.del(message);
    })
    .then(function() {
      return res.json({ deleted:true });
    })
    .catch(function(e) {
      return res.json({ error:e, deleted:false });
    });
  });
});

router.get('/user/informations', function(req, res, next) {
  session.settings(req, res, { shouldBeLogged:true }, function(settings) {
    return res.json(req.session.user);
  });
});

router.get('/logout', function(req, res, next) {
  session.settings(req, res, { shouldBeLogged:true }, function(settings) {
    req.session.destroy(function() {
      return res.redirect('/');
    });
  });
});

module.exports = router;
