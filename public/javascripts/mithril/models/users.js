/* global m */
'use strict';
var users = users || {};

/**
 * Users component - model
 */
users.User = function(data) {
  this.id     = m.prop(data.id);
  this.name   = m.prop(data.name);
  this.color  = m.prop(data.groupColor);
  this.avatar = m.prop(data.avatar);
  this.status = m.prop(data.status);
};

/**
 * Users component - storage model
 */
users.UsersList = function() {
  this.list = [];
  this.reinit = function() {
    this.list.length = 0;
  };
  this.push = function(user) {
    this.list.push(user);
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
  this.status = function(status, username) {
    var deferred = m.deferred();
    for(var i = 0; i < this.list.length; i++) {
      if(username == this.list[i].name()) {
        this.list[i].status(status);
        deferred.resolve();
      }
    }
    return deferred.promise;
  };
  this.users = function() {
    return this.list;
  };
};