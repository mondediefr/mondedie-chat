/* global m, document, messagesViewElement, mx, moment */
'use strict';
var messages = messages || {};
moment.locale('fr');

/**
 * Messages component - view
 */
messages.view = function(controller) {
  return m('ul#messages', {config: autoScroll}, [
    messages.vm.list.messages().map(function(message, index) {
      var user = message.user();
      var time = parseInt(message.time());
      var momentTime = moment(time);
      var messageTooltipTime = momentTime.format('ddd DD MMM YYYY à HH[h]mm');
      var messageTimeAgo = momentTime.fromNow();
      return m('li', {key: index, class: message.type() + ' clearfix'}, [
        removeButton(this, controller, message),
        privateMark(message.priv()),
        m('img', {
          class: 'rounded avatar-message float-xs-left',
          src: user.avatar || '/images/bender.jpeg',
          alt: user.name
        }),
        m('span', {
          class: 'username',
          style: {color: user.groupColor || '#373a3c'}
        }, user.name),
        m('span', {
          class: 'date',
          'data-time': time ? time : null,
          'data-toggle': 'tooltip',
          'data-placement': 'top',
          'data-original-title': messageTooltipTime,
          title: messageTooltipTime,
          innerText: time ? messageTimeAgo : ''
        }),
        m('span', {class: 'd-block text'}, m.trust(message.mess()))
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
  if(!isPriv)
    return null;
  return m('span', {class: 'float-xs-right private'},
    m('i', {title: 'Message privé', class: 'fa fa-lock'})
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
  if(!display || message.priv())
    return null;
  return mx('button', {
    class: 'float-xs-right close button-delete',
    'aria-label': 'Close',
    cautions: messages.vm.del.bind(instance, message.id()),
    'data-content': message.mess(),
    'data-username': message.user().name,
    'data-groupcolor': message.user().groupColor,
    'data-date': moment(parseInt(message.time())).format('dddd DD MMM YYYY à HH[h]mm')
  }, m('span', {'aria-hidden': 'true'}, m.trust('&times;')));
}

/**
 * Component mounting
 */
m.mount(messagesViewElement, {controller: messages.controller, view: messages.view});
