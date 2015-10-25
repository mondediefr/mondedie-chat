/* global m, document, Visibility */
'use strict';
var messages = messages || {};

/**
 * Messages component - model
 */
messages.Message = function(data) {
  this.id   = m.prop(data.id || null);
  this.type = m.prop(data.type || 'message');
  this.time = m.prop(data.time);
  this.user = m.prop(data.user || { name:'CHATBOT' });
  this.mess = m.prop(data.message);
  this.del  = m.prop(data.deleted || false);
};

/**
 * Messages component - storage model
 */
messages.MessagesList = function() {
  this.list = [];
  this.push = function(message) {
    if(Visibility.state() === 'hidden' && message.type() != 'message-bot')
      document.title = 'Nouveau(x) message(s) !';
    this.list.push(message);
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
  this.messages = function() {
    return this.list;
  };
};