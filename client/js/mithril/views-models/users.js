/* global m, $, socket */
'use strict';
var users = users || {};

/**
 * Users component - view-model
 */
users.vm = (function() {
  var vm = {};
  vm.init = function() {
    vm.list = new users.UsersList();
    vm.listen = (function () {
      if($('#clients li').length <= 0) {
        socket.on('user_connected', function(user) {
          vm.list.push(new users.User(user));
          m.redraw();
        });
        socket.on('user_new', function(time, username) {
          vm.list.reinit();
          m.redraw();
        });
        socket.on('user_disconnected', function(time, user) {
          vm.list.del(user.id).then(m.redraw);
        });
        socket.on('user_afk', function(time, username) {
          vm.list.status('afk', username).then(m.redraw);
        });
        socket.on('user_unafk', function(time, username) {
          vm.list.status('online', username).then(m.redraw);
        });
        socket.on('disconnect', function() {
          vm.list.reinit();
          m.redraw();
        });
      }
    }());
  };
  return vm;
}());