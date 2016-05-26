"use strict";
if(process.env.ENV !== 'production')
  require('dotenv').load();

var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var serveStatic  = require('serve-static');
var Session      = require('express-session');
var validator    = require('express-validator');
var ms           = require('ms');
var RedisStore   = require('connect-redis')(Session);

var redis  = require('./libs/redis')();
var socket = require('./libs/socket');
var routes = require('./routes/index');

var app    = express();
var server = require("http").createServer(app);
var io     = require("socket.io")(server);
var ios    = require('socket.io-express-session');

app.set('env', process.env.ENV || 'development');
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Initialisation de Redis
redis.init(redis.client);

// Initialisation de la session
var session = new Session({
  store: new RedisStore({ client:redis.client }),
  secret: process.env.SESSION_SECRET,
  key: 'SID',
  resave:true,
  saveUninitialized:true
});

// Initialisation du socket
io.use(ios(session));
socket.init(io);

if(app.get('env') == 'development') {
  app.use(logger('dev'));
  var edt = require('express-debug');
  edt(app);
}

app.use(favicon(path.join(__dirname, 'public/images/favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser(process.env.COOKIES_SECRET));
app.use(session);

function setHeaders(res, path, stat) {
  // Activation du cache pendant 30 jours pour les fichiers statiques
  res.setHeader('Cache-Control', 'private');
  res.setHeader('Expires', new Date(Date.now() + ms('30d')).toUTCString());
  // Désactivation du cache pendant le développement
  // res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1
  // res.setHeader('Expires', 0); // Proxies
  // res.setHeader('Pragma', 'no-cache');  // HTTP 1.0
}

app.use(serveStatic(path.join(__dirname, 'public'), { maxAge:ms('30d'), setHeaders:setHeaders }));

/*
*  ROUTES
*/
app.use('/', routes);

/*
*  ERREUR 404
*/
app.use(function(req, res, next) {
  var err = new Error('Page introuvable');
  err.status = 404;
  next(err);
});

/*
*  TOUTES LES AUTRES ERREURS
*/
app.use(function(err, req, res, next) {
  if(res.headersSent) return next(err);
  var env = app.get('env');
  var status = err.status || 500;
  res.status(status);
  return res.render('error', {
    message: err.message,
    status: status,
    stack: env === 'development' ? err.stack : null
  });
});

server.listen(app.get('port'));
