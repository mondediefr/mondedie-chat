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
  this.time = m.prop(data.time);
	this.user = m.prop(data.user);
	this.mess = m.prop(data.mess);
};

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
    // Listen for new messages
    vm.listen = (function () {
      m.startComputation();
      socket.on('message', function(time, user, mess) {
        try {
          vm.list.push(new chat.Message({ time:time, user:user, mess:mess }));
        } catch(e) {
          console.log(e);
        } finally {
          m.endComputation();
        }
      });
    })();
  };
  return vm;
}());

// Controller
chat.controller = function() {
  socket.once('connect', function() {
    chat.vm.init();
  });
};

// View
chat.view = function() {
  return m("#messages-box", { class:'col-md-10' }, [
    m("ul#messages", [
      chat.vm.list.map(function(message, i) {
        var user = message.user();
        return m("li", { class:'message' }, [
          '(' + message.time() + ')',
          m("b", m("span", { class:'username', style: { color: user.groupColor }}, user.name ? user.name : 'CHATBOT'), ': '),
          message.mess()
        ])
      })
    ]),
    m("form", { class:'form-chat' }, [
      m("textarea", {
        id:'message',
        rows:'10',
        autocomplete:'off',
        placeholder:'Votre message...',
        maxlength:'1000',
        onchange: m.withAttr("value", chat.vm.mess)
      }),
      m("hr"),
      m("button", { type:'button', class:'btn btn-info', onclick: chat.vm.add }, "Envoyer")
    ])
  ])
};

m.mount(viewDomElement, { controller: chat.controller, view: chat.view });