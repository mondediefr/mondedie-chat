var session = {};

session.settings = function( req, res, options, callback ) {

  var isLogged = ( req.session.user ) ? true : false;

  if( !! options.shouldBeLogged && ! isLogged ) {
    res.redirect('/');
    return;
  }

  if( ! options.shouldBeLogged && isLogged ) {

  if( ! options.mayBeLogged ) {
    res.redirect('/chatroom');
    return;
  }

  }

  var settings = {
    path:req.path,
    title:"Mondedie-chat - ",
    isLogged:isLogged
  };

  if( isLogged ) {

    var isAdmin = ( req.session.user.groupName === 'Admins' ) ? true : false;

    settings.user    = req.session.user;
    settings.isAdmin = isAdmin;

    if( !! options.shouldBeAdmin && ! isAdmin ) {
      res.redirect('/');
      return;
    }

  }

  callback( settings );

};

module.exports = session;