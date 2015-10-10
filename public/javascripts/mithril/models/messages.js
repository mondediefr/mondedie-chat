/* global Visibility */

/**
 * Messages component - model
 */
messages.Message = function(data) {
  this.type = m.prop(data.type || 'message');
  this.time = m.prop(data.time);
  this.user = m.prop(data.user || { name:'CHATBOT' });
  this.mess = m.prop(data.mess);
};

/**
 * Messages component - storage model
 */
messages.MessagesList = function() {
  this.list = [];
  this.push = function(message) {
    if(Visibility.state() === 'hidden')
      document.title = 'Nouveau(x) message(s) !';
    this.list.push(message);
  };
  this.messages = function() {
    return this.list;
  };
};