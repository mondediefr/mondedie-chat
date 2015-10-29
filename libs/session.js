"use strict";
var session = {};

session.settings = function(req, res, options, callback) {

  var isLogged = (req.session.user) ? true : false;

  if(!! options.shouldBeLogged && ! isLogged)
    return res.redirect('/');

  if(! options.shouldBeLogged && isLogged) {
    if(! options.mayBeLogged)
      return res.redirect('/chatroom');
  }

  var settings = {
    path:req.path,
    title:"Mondedie-chat - ",
    isLogged:isLogged
  };

  if(isLogged) {
    var isAdmin;
    if(req.session.user.groupName === 'Administrateurs' ||
    req.session.user.groupName === 'Modérateurs' ||
    req.session.user.groupName === 'Bonobo')
      isAdmin = true;
    else
      isAdmin = false;
    req.session.user.isAdmin = isAdmin;
    settings.user = req.session.user;
    if(!! options.shouldBeAdmin && ! isAdmin)
      return res.redirect('/');
  }

  callback(settings);

};

module.exports = session;