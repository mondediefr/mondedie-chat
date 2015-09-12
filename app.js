var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var serveStatic  = require('serve-static');
var session      = require('express-session');
var validator    = require('express-validator');
var ms           = require('ms');

var socket = require('./socket');
var routes = require('./routes/index');

var app = express();

app.set('env', process.env.ENV || 'development');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser(process.env.COOKIES_SECRET));
app.use(session({ secret: process.env.SESSION_SECRET, key: 'SID', resave:true, saveUninitialized:true }));

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


var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d', app.get('port'));
});

socket.init( server );