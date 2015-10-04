var socket = io();
var editor = null;

$(function(){

  // ========================= JQUERY =========================
  // TODO : Convertir le code suivant avec Mihtril
  
  $('#banLink').click(function(e) {
    $('#banPopup').modal();
    e.preventDefault();
  });

  $('#banPopup').find('button[role="ban"]').click(function(e) {
    var username = $('input[name="userBanned"]').val();
    socket.emit('ban', username);
    $('#banPopup').modal('hide');
    e.preventDefault();
  });

  $('#banPopup').find('button[role="unban"]').click(function(e) {
    var username = $('input[name="userBanned"]').val();
    socket.emit('unban', username);
    $('#banPopup').modal('hide');
    e.preventDefault();
  });

  $(document).on('click', '.username', function() {
    var username = $(this).text();
    editor.value('**@' + username + ':** ');
  });

  /*
  $(document).on('click', '.delete', function() {
    var id = $(this).data().id;
    $.get('/del/message/'+id);
  });
  */

  // ========================= EDITOR =========================

  editor = new SimpleMDE({
    autofocus: true,
    autosave: {
      enabled: true,
      unique_id: 'chatForm',
      delay: 1000
    },
    toolbar: [
      'bold', 'italic', 'strikethrough', '|', 'code', 'quote', 'unordered-list',
      'horizontal-rule', '|', 'link', 'image', '|', 'preview', 'side-by-side', 'fullscreen'
    ],
    indentWithTabs: false,
    renderingConfig: {
      codeSyntaxHighlighting: true,
    },
    spellChecker: false,
    status: false,
    tabSize: 4,
    toolbarTips: false
  });

});

// ==================== MITHRIL COMPONENT ===================

// Chat Main Namespace
var chat = {};
var viewDomElement = document.getElementById("content-messages");

// Model
chat.Message = function(data) {
  this.type = m.prop(data.type || 'message');
  this.time = m.prop(data.time);
  this.user = m.prop(data.user || { name:'CHATBOT' });
  this.mess = m.prop(data.mess);
};

// Messages list storage
// chat.MessagesList = Array;
chat.MessagesList = function() {
  this.list = [];
  this.push = function(message) {
    this.list.push(message);
  };
  this.messages = function() {
    return this.list;
  };
};

// View-Model
chat.vm = (function() {
  var vm = {};
  vm.load = function() {
    var deferred = m.deferred();
    vm.list = new chat.MessagesList();
    // Load initial messages list
    vm.loadmessages = function(res) {
      res.messages.filter(function(m, i) {
        if( ! m.user )
          vm.list.push(new chat.Message({ type:'message-bot', time:m.time, mess:m.message }));
        else
          vm.list.push(new chat.Message({ time:m.time, user:m.user, mess:m.message  }));
      });
    };
    // Send a message
    vm.send = function() {
      if(editor.value()) {
        socket.emit('message', editor.value());
        editor.value('');
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
        vm.list.push(new chat.Message({ time:time, user:user, mess:mess }));
        m.redraw();
      });
      socket.on('botMessage', function(time, mess) {
        vm.list.push(new chat.Message({ type:'message-bot', time:time, mess:mess }));
        m.redraw();
      });
      socket.on('user_new', function(time, username) {
        vm.list.push(new chat.Message({
          type:'message-bot',
          time:time,
          mess:username + " s'est connecté"
        }));
        m.redraw();
      });
      socket.on('user_disconnected', function(time, user) {
        vm.list.push(new chat.Message({
          type:'message-bot',
          time:time,
          mess:user.name + " s'est déconnecté"
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
        vm.list.push(new chat.Message({
          type:'message-warning',
          mess:'Vous êtes déconnecté du chat !'
        }));
        m.redraw();
      });
      socket.on('reconnecting', function(attempt) {
        if(attempt == 1)
          vm.list.push(new chat.Message({
            type:'message-warning',
            mess:'Tentative de connexion au serveur en cours...'
          }));
        else if(attempt == 10)
          vm.list.push(new chat.Message({
            type:'message-error',
            mess:'Impossible de rétablir la connexion avec le serveur, recharger la page ou réessayer ultérieurement..'
          }));
        m.redraw();
      });
      socket.on('reconnect', function() {
        vm.list.push(new chat.Message({
          type:'message-success',
          mess:'Connexion au chat réussie !'
        }));
        m.redraw();
      });
      socket.on('error', function() {
        vm.list.push(new chat.Message({
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

// Controller
chat.controller = function() {
  chat.vm.load().then(chat.vm.initsockets);
};

// View
chat.view = function() {
  return m("#messages-box", { class:'col-md-10' }, [
    m("ul#messages", { config:autoScroll }, [
      chat.vm.list.messages().map(function(message, i) {
        var user = message.user();
        return m("li", { class:message.type() }, [
          ( message.time() ? message.time() : "" ) + ' ',
          m("b", m("span", { class:'username', style:{ color:user.groupColor }}, user.name), ': '),
          m.trust(message.mess())
        ])
      })
    ]),
    m("form", { class:'form-chat' }, [
      m("textarea"),
      m("hr"),
      m("button", { type:'button', class:'btn btn-info', onclick:chat.vm.send }, "Envoyer")
    ])
  ])
};

// ==================== DOM METHODS ===================

function autoScroll(element) {
  element.scrollTop = element.scrollHeight;
}

m.mount(viewDomElement, { controller:chat.controller, view:chat.view });

// ==================== MITHRIL USERS COMPONENT ===================

// Users Namespace
var users = {};
var usersViewElement = document.getElementById("content-users");

// Model
users.User = function(data) {
  this.id     = m.prop(data.id);
  this.name   = m.prop(data.name);
  this.color  = m.prop(data.color);
  this.avatar = m.prop(data.avatar);
};

// Users list storage
// users.UsersList = Array;
users.UsersList = function() {
  this.list = [];
  this.reinit = function() {
    this.list.length = 0;
  };
  this.push = function(user) {
    this.list.push(user);
  };
  this.del = function(id) {
    var deferred = m.deferred();
    for(var i = 0; i < this.list.length; i++) {
      if(id == this.list[i].id()) {
        this.list.splice(i, 1);
        deferred.resolve();
      }
    }
    return deferred.promise;
  };
  this.users = function() {
    return this.list;
  };
};

// View-Model
users.vm = (function() {
  var vm = {};
  vm.init = function() {
    vm.list = new users.UsersList();
    vm.listen = (function () {
      socket.on('user_connected', function(user) {
        vm.list.push(new users.User({
          id:user.id,
          name:user.name,
          color:user.groupColor,
          avatar:user.avatar
        }));
        m.redraw();
      });
      socket.on('user_new', function(time, username) {
        vm.list.reinit();
        m.redraw();
      });
      socket.on('user_disconnected', function(time, user) {
        vm.list.del(user.id).then(m.redraw);
      });
    }());
  };
  return vm;
}());

// Controller
users.controller = function() {
  users.vm.init();
};

// View
users.view = function() {
  return m("ul#clients", [
    users.vm.list.users().map(function(user, i) {
      return m("li", { style:{ color:user.color() }}, [
        m("img", { class:'img-circle', src:user.avatar(), alt:user.name() }),
        user.name()
      ])
    })
  ])
};

m.mount(usersViewElement, { controller:users.controller, view:users.view });