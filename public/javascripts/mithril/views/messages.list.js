/* global m, messagesViewElement */
'use strict';
var messages = messages || {};

/**
 * Messages component - view
 */
messages.view = function() {
  return m("#messages-box", [
    m("ul#messages", { config:autoScroll }, [
      messages.vm.list.messages().map(function(message, i) {
        var user = message.user();
        return m("li", { class:message.type() }, [
          ( message.time() ? message.time() : "" ) + ' ',
          m("b", m("span", { class:'username', style:{ color:user.groupColor }}, user.name), ': '),
          m.trust(message.mess())
        ])
      })
    ])
  ])
};

/**
 * DOM methods
 */
function autoScroll(element) {
  element.scrollTop = element.scrollHeight;
}

/**
 * Component mounting
 */
m.mount(messagesViewElement, { controller:messages.controller, view:messages.view });