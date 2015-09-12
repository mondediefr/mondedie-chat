var socket = {};

socket.init = function( server ) {

    io = require('socket.io').listen( server );
    io.on('connection', function( socket ) {

        io.emit('chat message', "Un utilisateur s'est connecté");

        socket.on('chat message', function( message ){
          io.emit('chat message', message);
        });

        socket.on('disconnect', function(){
          io.emit('chat message', "Un utilisateur s'est déconnecté");
        });

    });

};

module.exports = socket;