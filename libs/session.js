var session = {};

session.settings = function( req, res, options, callback ) {

  var isLogged = ( req.session.user ) ? true : false;

  if( !! options.shouldBeLogged && ! isLogged )
    return res.redirect('/');

  if( ! options.shouldBeLogged && isLogged ) {
    if( ! options.mayBeLogged )
      return res.redirect('/chatroom');
  }

  var settings = {
    path:req.path,
    title:"Mondedie-chat - ",
    isLogged:isLogged
  };

  if( isLogged ) {
    var isAdmin = ( req.session.user.groupName === 'Admins' ) ? true : false;
    settings.user = req.session.user;
    settings.isAdmin = isAdmin;
    if( !! options.shouldBeAdmin && ! isAdmin )
      return res.redirect('/');
  }

  callback( settings );

};

module.exports = session;