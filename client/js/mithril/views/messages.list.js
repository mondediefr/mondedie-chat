/* global m, document, messagesViewElement, mx, moment */
'use strict';
var messages = messages || {};

/**
 * Messages component - view
 */
messages.view = function(controller) {
  return m("ul#messages", { config:autoScroll }, [
    messages.vm.list.messages().map(function(message, index) {
      var user = message.user();
      var time = parseInt(message.time());
      moment.locale('fr');
      var messageTooltipTime = moment(time).format('DD MMMM YYYY [à] HH[h]mm');
      var messageTime = moment(time).format('HH[h]mm');
      return m("li", { key:index, class:message.type() }, [
        removeButton(this, controller, message),
        privateMark(message.priv()),
        m("img", {
          class: 'img-rounded avatar-message',
          src: user.avatar || '/images/bender.gif',
          alt: user.name
        }),
        m("span", { class:'username', style:{ color:user.groupColor || '#373a3c' }}, user.name),
        m("span", {
          class:'date',
          'data-toggle': 'tooltip',
          'data-placement':'top',
          'data-original-title': messageTooltipTime,
          title: messageTooltipTime
        }, (time ? messageTime : '')),
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

function privateMark(isPriv) {
  if(!isPriv) return null;
  return m("span", { class:'private' },
    m("i", { title:'Message privé', class:'fa fa-lock' })
  );
}

function removeButton(instance, controller, message) {
  var display = false;
  if(message.type() === 'message') {
    if(controller.user().isAdmin)
      display = true
    else if(controller.user().name === message.user().name)
      display = true
  }
  if(!display || message.priv()) return null;
  return mx("a.option[href='#']", {
    cautions:messages.vm.del.bind(instance, message.id())
  }, m("i", { class:'fa fa-times' }));
}

/**
 * Component mounting
 */
m.mount(messagesViewElement, { controller:messages.controller, view:messages.view });
