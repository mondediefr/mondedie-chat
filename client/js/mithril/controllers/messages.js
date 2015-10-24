/* global m */
'use strict';
var messages = messages || {};

/**
 * Messages component - controller
 */
messages.controller = function() {
  this.user = m.prop([]);
  messages.vm.load()
  .then(messages.vm.initsockets)
  .then(function() {
    return m.request({ method: 'GET', url: '/user/informations' });
  })
  .then(this.user);
};