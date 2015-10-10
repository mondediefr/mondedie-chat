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
      res.messages.filter(function(m, i) {
        if( ! m.user )
          vm.list.push(new messages.Message({ type:'message-bot', time:m.time, mess:m.message }));
        else
          vm.list.push(new messages.Message({ time:m.time, user:m.user, mess:m.message  }));
      });
    };
    // Send a message
    vm.send = function() {
      var message = editor.value();
      if(!message)
        return;
      if(message.indexOf('/') === 0)
        vm.cmd(message.trim());
      else
        socket.emit('message', message);
      editor.value('');
    };
    // Parse a command
    vm.cmd = function(message) {
      switch(message) {
        case '/afk on':
          socket.emit('afk');
          break;
        case '/afk off':
          socket.emit('unafk');
          break;
        default:
          vm.list.push(new messages.Message({
            type:'message-warning',
            mess:'"' + message + '" -> commande inconnue...'
          }));
          m.redraw();
          break;
      }
    };
    // Get and load messages list
    m.request({ method: "GET", url: "/get/messages"})
    .then(vm.loadmessages)
    .then(m.redraw)
    .then(deferred.resolve);

    return deferred.promise;
  };
  vm.initsockets = function() {
    vm.listen = (function () {
      // ==================== CHAT EVENTS ===================
      socket.on('ping', function(data) {
        socket.emit('pong', { beat: 1 });
      });
      socket.on('message', function(time, user, mess) {
        vm.list.push(new messages.Message({ time:time, user:user, mess:mess }));
        m.redraw();
      });
      socket.on('botMessage', function(time, mess) {
        vm.list.push(new messages.Message({ type:'message-bot', time:time, mess:mess }));
        m.redraw();
      });
      socket.on('user_new', function(time, username) {
        vm.list.push(new messages.Message({
          type:'message-bot',
          time:time,
          mess:username + " s'est connecté"
        }));
        m.redraw();
      });
      socket.on('user_disconnected', function(time, user) {
        vm.list.push(new messages.Message({
          type:'message-bot',
          time:time,
          mess:user.name + " s'est déconnecté"
        }));
        m.redraw();
      });
      socket.on('user_afk', function(time, username) {
        vm.list.push(new messages.Message({
          type:'message-bot',
          time:time,
          mess:username + " est AFK"
        }));
        m.redraw();
      });
      socket.on('user_unafk', function(time, username) {
        vm.list.push(new messages.Message({
          type:'message-bot',
          time:time,
          mess:username + " n'est plus AFK"
        }));
        m.redraw();
      });
      socket.on('already_connected', function() {
        alert('Vous êtes déjà connecté, connexion au chat impossible !');
      });
      socket.on('user_banned', function() {
        alert('Impossible de se connecter au chat, vous avez été banni.');
      });
      socket.on('user_notfound', function() {
        alert('Utilisateur introuvable...');
      });
      socket.on('ban', function() {
        location.reload();
      });
      // ==================== GENERALS EVENTS ===================
      socket.on('disconnect', function() {
        vm.list.push(new messages.Message({
          type:'message-warning',
          mess:'Vous êtes déconnecté du chat !'
        }));
        m.redraw();
      });
      socket.on('reconnecting', function(attempt) {
        if(attempt == 1)
          vm.list.push(new messages.Message({
            type:'message-warning',
            mess:'Tentative de connexion au serveur en cours...'
          }));
        else if(attempt == 10)
          vm.list.push(new messages.Message({
            type:'message-error',
            mess:'Impossible de rétablir la connexion avec le serveur, recharger la page ou réessayer ultérieurement..'
          }));
        m.redraw();
      });
      socket.on('reconnect', function() {
        vm.list.push(new messages.Message({
          type:'message-success',
          mess:'Connexion au chat réussie !'
        }));
        m.redraw();
      });
      socket.on('error', function() {
        vm.list.push(new messages.Message({
          type:'message-error',
          mess:'Une erreur est survenue lors de la connexion au serveur, recharger la page ou réessayer ultérieurement.'
        }));
        m.redraw();
      });
      // ========================================================
    })();
  };
  return vm;
}());