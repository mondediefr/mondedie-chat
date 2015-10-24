/* global m, socket, location, alert, notify, textarea */
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
    // Redraw all message list
    vm.redrawAll = function() {
      m.redraw.strategy('all');
      m.redraw();
      m.redraw.strategy('diff');
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
      textarea.value = null;
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
      else if(message.substring(0, 5) == '/kick')
        socket.emit('ban', message.substring(6));
      else if(message.substring(0, 6) == '/unban')
        socket.emit('unban', message.substring(7));
      else if(message.substring(0, 7) == '/unlock')
        socket.emit('unlock', message.substring(8));
      else if(message.substring(0, 5) == '/poke')
        socket.emit('highlight', message.substring(6));
      else if(message.substring(0, 5) == '/roll') {
        if(message.substring(6) == 'BXT')
          socket.emit('rollBXT');
        else
          socket.emit('roll', message.substring(6));
      } else if(message.substring(0, 4) == '/msg') {
        var arr = message.split(' ');
        var res = arr.splice(0, 2);
        res.push(arr.join(' '));
        socket.emit('private_message', res[1], res[2]);
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
        vm.list.del(id).then(vm.redrawAll);
      });
      socket.on('user_new', function(time, username) {
        vm.list.push(new messages.Message({
          type:'message-bot',
          time:time,
          message:username + " s'est connecté"
        }));
        m.redraw();
      });
      socket.on('user_disconnected', function(time, user) {
        vm.list.push(new messages.Message({
          type:'message-bot',
          time:time,
          message:user.name + " s'est déconnecté"
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
        vm.list.push(new messages.Message({
          type:'message-error',
          message:'Vous êtes déjà connecté, connexion au chat impossible !'
        }));
        m.redraw();
      });
      socket.on('user_banned', function() {
        vm.list.push(new messages.Message({
          type:'message-error',
          message:'Impossible de se connecter au chat, vous avez été banni.'
        }));
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
            message:'Impossible de rétablir la connexion avec le serveur, recharger la page ou réessayer ultérieurement..'
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