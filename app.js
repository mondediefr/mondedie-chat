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

var redis  = require('./libs/redis');
var socket = require('./libs/socket');
var routes = require('./routes/index');

var app    = express();
var server = require("http").createServer(app);
var io     = require("socket.io")(server);
var ios    = require('socket.io-express-session');

var session = Session({
  secret: process.env.SESSION_SECRET,
  key: 'SID',
  resave:true,
  saveUninitialized:true
});

io.use(ios(session));
socket.init(io);
redis.init();

app.set('env', process.env.ENV || 'development');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// if(app.get('env') == 'development') {
  app.use(logger('dev'));
  var edt = require('express-debug');
  edt(app);
// }

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser(process.env.COOKIES_SECRET));
app.use(session);

function setHeaders( res, path, stat ) {
  res.setHeader('Expires', new Date(Date.now() + ms('1y')).toUTCString());
}

app.use(serveStatic(path.join(__dirname, 'public'), { maxAge:ms('1y'), setHeaders:setHeaders }));

/*
 *  ROUTES
 */
app.use('/', routes);

/*
 *  ERREUR 404
 */
app.use(function( req, res, next ) {
  var err = new Error('Not Found');
  err.status = 404;
  next( err );
});

/*
 *  TOUTES LES AUTRES ERREURS
 */
if (app.get('env') === 'development') {
  app.use(function( err, req, res, next ) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function( err, req, res, next ) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

server.listen(app.get('port'));