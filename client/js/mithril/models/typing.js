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
    var username = user.name();
    if(this.list.indexOf(username) < 0)
      this.list.push(username);
  };
  this.del = function(username) {
    var deferred = m.deferred();
    for(var i = 0; i < this.list.length; i++) {
      if(username == this.list[i]) {
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