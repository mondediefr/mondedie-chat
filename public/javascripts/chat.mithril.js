var socket = io();

// ========================= EDITOR =========================

/*
var editor = new SimpleMDE({
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
*/

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

// Stockage de la liste des messages
chat.MessagesList = Array;

// View-Model
chat.vm = (function() {
  var vm = {};
  vm.init = function() {
    // Properties
    vm.list = new chat.MessagesList();
    vm.mess = m.prop('');
    // Send a message
    vm.send = function() {
      if(vm.mess()) {
        socket.emit('message', vm.mess());
        vm.mess('');
      }
    };
    vm.listen = (function () {
      // ==================== CHAT EVENTS ===================
      socket.on('message', function(time, user, mess) {
        vm.list.push(new chat.Message({ time:time, user:user, mess:mess }));
        m.redraw();
      });
      socket.on('botMessage', function(time, mess) {
        vm.list.push(new chat.Message({ type:'message-bot', time:time, mess:mess }));
        m.redraw();
      });
      socket.on('user_new', function(time, username) {
        // $("ul#clients").text("");
        vm.list.push(new chat.Message({
          type:'message-bot',
          time:time,
          mess:username + " s'est connecté"
        }));
        m.redraw();
      });
      socket.on('user_disconnected', function(time, user) {
        // $("ul#clients li." + user.id).remove();
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
    })();
  };
  return vm;
}());

// Controller
chat.controller = function() {
  chat.vm.init();
};

function onSubmitForm(element) {
  element.reset();
}

// View
chat.view = function() {
  return m("#messages-box", { class:'col-md-10' }, [
    m("ul#messages", [
      chat.vm.list.map(function(message, i) {
        var user = message.user();
        return m("li", { class:message.type() }, [
          '(' + message.time() + ') ',
          m("b", m("span", { class:'username', style: { color: user.groupColor }}, user.name), ': '),
          m.trust(message.mess())
        ])
      })
    ]),
    m("form", { config: onSubmitForm, class:'form-chat' }, [
      m("textarea", {
        id:'message',
        rows:'5',
        cols:'140',
        autocomplete:'off',
        placeholder:'Votre message...',
        maxlength:'1000',
        onchange: m.withAttr("value", chat.vm.mess)
      }),
      m("hr"),
      m("button", { type:'button', class:'btn btn-info', onclick: chat.vm.send }, "Envoyer")
    ])
  ])
};

m.mount(viewDomElement, { controller: chat.controller, view: chat.view });