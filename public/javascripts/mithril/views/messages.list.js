/* global m, document, messagesViewElement */
'use strict';
var messages = messages || {};

/**
 * Messages component - view
 */
messages.view = function() {
  return m("ul#messages", { config:autoScroll }, [
    messages.vm.list.messages().map(function(message, i) {
      var user = message.user();
      return m("li", { class:message.type() }, [
        m("span", { class:'date' }, ( message.time() ? '[' + message.time() + '] ' : '' )),
        m("span", { class:'username', style:{ color:user.groupColor }}, user.name + ': '),
        m("span", { class:'text' }, m.trust(message.mess())),
        m("a.option[href='#']", m("i", { class:'fa fa-times' }))
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

/**
 * Component mounting
 */
m.mount(messagesViewElement, { controller:messages.controller, view:messages.view });
