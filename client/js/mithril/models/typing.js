/* global m */
'use strict';
var typing = typing || {};

/**
 * Typing component - model
 */
typing.User = function(data) {
  this.name = m.prop(data.name);
};

/**
 * Typing component - storage model
 */
typing.UsersList = function() {
  this.list = [];
  this.push = function(user) {
    if(this.list.indexOf(user) == -1)
      this.list.push(user);
  };
  this.del = function(username) {
    var deferred = m.deferred();
    for(var i = 0; i < this.list.length; i++) {
      if(username == this.list[i].name()) {
        this.list.splice(i, 1);
        deferred.resolve();
      }
    }
    return deferred.promise;
  };
  this.users = function() {
    return this.list;
  };
};