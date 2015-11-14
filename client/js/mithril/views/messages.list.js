/* global m, document, messagesViewElement, mx */
'use strict';
var messages = messages || {};

/**
 * Messages component - view
 */
messages.view = function(controller) {
  return m("ul#messages", { config:autoScroll }, [
    messages.vm.list.messages().map(function(message, index) {
      var user = message.user();
      return m("li", { key:index, class:message.type() }, [
        removeButton(this, controller, message),
        m("span", { class:'date' }, ( message.time() ? '[' + message.time() + '] ' : '' )),
        m("span", { class:'username', style:{ color:user.groupColor || '#373a3c' }}, user.name + ': '),
        m("span", { class:'text' }, m.trust(message.mess()))
      ])
    })
  ])
};

/**
 * DOM methods
 */
function autoScroll(element) {
  if(!document.getElementById('disable-auto-scroll').checked)
    messagesViewElement.scrollTop = element.scrollHeight;
}

function removeButton(instance, controller, message) {
  var display = false;
  if(message.type() === 'message') {
    if(controller.user().isAdmin)
      display = true
    else if(controller.user().name === message.user().name)
      display = true
  }
  if(!display) return null;
  return mx("a.option[href='#']", {
    cautions:messages.vm.del.bind(instance, message.id())
  }, m("i", { class:'fa fa-times' }));
}

/**
 * Component mounting
 */
m.mount(messagesViewElement, { controller:messages.controller, view:messages.view });
