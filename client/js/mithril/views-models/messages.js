/* global m, document, socket, location, alert, notify, textarea */
'use strict';
var messages = messages || {};

/**
 * Messages component - view-model
 */
messages.vm = (function() {
  var vm = {};
  vm.load = function() {
    var deferred = m.deferred();
    vm.list = new messages.MessagesList();
    // Load initial messages list
    vm.loadmessages = function(res) {
      res.messages.filter(function(message) {
        return message.deleted == "false"
      }).forEach(function(message) {
        if(!message.user)
          message.type = 'message-bot';
        vm.list.push(new messages.Message(message));
      });
    };
    // Send a message
    vm.send = function() {
      var message = textarea.value;
      if(!message)
        return;
      if(message.indexOf('/') === 0)
        vm.cmd(message.trim());
      else
        socket.emit('message', message);
      textarea.value = '';
    };
    // Remove a message
    vm.del = function(id) {
      m.request({ method: 'DELETE', url: '/delete/message', data:{ id:id }})
      .then(function(res) {
        if(res.deleted)
          socket.emit('remove_message', id);
      })
    };
    // Parse a command
    vm.cmd = function(message) {
      if(message == '/afk on')
        socket.emit('afk');
      else if(message == '/afk off')
        socket.emit('unafk');
      else if(message == '/ban list')
        socket.emit('banlist');
      else if(message.substring(0, 7) == '/kick @')
        socket.emit('ban', message.substring(7));
      else if(message.substring(0, 8) == '/unban @')
        socket.emit('unban', message.substring(8));
      else if(message.substring(0, 9) == '/unlock @')
        socket.emit('unlock', message.substring(9));
      else if(message.substring(0, 7) == '/poke @')
        socket.emit('highlight', message.substring(7));
      else if(message.substring(0, 5) == '/roll') {
        if(message.substring(6, 7) == '@')
          socket.emit('rolluser', message.substring(7));
        else
          socket.emit('roll', message.substring(6));
      } else if(message.substring(0, 6) == '/msg @') {
        var arr = message.split(' ');
        var res = arr.splice(0, 2);
        res.push(arr.join(' '));
        socket.emit('private_message', res[1].substring(1), res[2]);
      } else {
        vm.list.push(new messages.Message({
          type:'message-warning',
          message:'"' + message + '" -> commande inconnue...'
        }));
        m.redraw();
      }
    };
    // Get and load messages list
    m.request({ method: 'GET', url: '/get/messages'})
    .then(vm.loadmessages)
    .then(m.redraw)
    .then(deferred.resolve);

    return deferred.promise;
  };
  // Envoyer une notification
  vm.notification = function(message) {
    if(notify.permissionLevel() === notify.PERMISSION_GRANTED) {
      notify.createNotification('Mondedie::chat', {
        body:message,
        icon:'http://mondedie.fr/img/favicon.png'
      });
    }
  };
  vm.initsockets = function() {
    vm.listen = (function () {
      // ==================== CHAT EVENTS ===================
      socket.on('ping', function(data) {
        socket.emit('pong', { beat: 1 });
      });
      socket.on('message', function(message) {
        vm.list.push(new messages.Message(message));
        m.redraw();
      });
      socket.on('remove_message', function(id) {
        vm.list.del(id)
        .then(function() {
          m.redraw.strategy('all');
        }).then(m.redraw)
        .then(function() {
          m.redraw.strategy('diff');
        });
      });
      socket.on('user_new', function(time, username) {
        if(document.getElementById('disable-login-events').checked)
          return;
        vm.list.push(new messages.Message({
          type:'message-bot',
          time:time,
          message:username + " vient de se connecter"
        }));
        m.redraw();
      });
      socket.on('user_disconnected', function(time, user) {
        if(document.getElementById('disable-login-events').checked)
          return;
        vm.list.push(new messages.Message({
          type:'message-bot',
          time:time,
          message:user.name + " vient de se déconnecter"
        }));
        m.redraw();
      });
      socket.on('user_afk', function(time, username) {
        vm.list.push(new messages.Message({
          type:'message-bot',
          time:time,
          message:username + " est AFK"
        }));
        m.redraw();
      });
      socket.on('user_unafk', function(time, username) {
        vm.list.push(new messages.Message({
          type:'message-bot',
          time:time,
          message:username + " n'est plus AFK"
        }));
        m.redraw();
      });
      socket.on('user_highlight', function(time, username) {
        vm.notification('Vous avez reçu un poke de @' + username);
        vm.list.push(new messages.Message({
          type:'message-bot',
          time:time,
          message:"Poke de @" + username
        }));
        m.redraw();
      });
      socket.on('already_connected', function() {
        var message = "Vous êtes déjà connecté au chat. Si ce n'est pas le cas, veuillez patienter quelques instants.";
        vm.list.push(new messages.Message({
          type:'message-error',
          message:message
        }));
        alert(message);
        m.redraw();
      });
      socket.on('user_banned', function() {
        var message = 'Impossible de se connecter au chat, vous avez été banni.'
        vm.list.push(new messages.Message({
          type:'message-error',
          message:message
        }));
        alert(message);
        m.redraw();
      });
      socket.on('ban', function() {
        vm.notification('Vous avez été banni du chat !');
        location.reload();
      });
      socket.on('private_notification', function(username) {
        vm.notification('Vous avez reçu un message privé de la part de @' + username);
      });
      // ==================== GENERALS EVENTS ===================
      socket.on('disconnect', function() {
        vm.list.push(new messages.Message({
          type:'message-warning',
          message:'Vous êtes déconnecté du chat !'
        }));
        m.redraw();
      });
      socket.on('reconnecting', function(attempt) {
        if(attempt == 1) {
          vm.list.push(new messages.Message({
            type:'message-warning',
            message:'Tentative de connexion au serveur en cours...'
          }));
        } else if(attempt == 10) {
          vm.notification('Impossible de rétablir la connexion avec le serveur.');
          vm.list.push(new messages.Message({
            type:'message-error',
            message:'Impossible de rétablir la connexion avec le serveur, recharger la page ou réessayer ultérieurement.'
          }));
        }
        m.redraw();
      });
      socket.on('reconnect', function() {
        vm.list.push(new messages.Message({
          type:'message-success',
          message:'Connexion au chat réussie !'
        }));
        m.redraw();
      });
      socket.on('error', function() {
        vm.list.push(new messages.Message({
          type:'message-error',
          message:'Une erreur est survenue lors de la connexion au serveur, recharger la page ou réessayer ultérieurement.'
        }));
        m.redraw();
      });
      // ========================================================
    })();
  };
  return vm;
}());
