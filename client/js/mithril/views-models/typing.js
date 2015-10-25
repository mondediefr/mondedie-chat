/* global m, socket */
'use strict';
var typing = typing || {};

/**
 * Typing component - view-model
 */
typing.vm = (function() {
  var vm = {};
  vm.init = function() {
    vm.list = new typing.UsersList();
    vm.listen = (function () {
      socket.on('isTyping', function(data) {
        if(data.isTyping)
          vm.list.push(new typing.User({ name:data.user }));
        else
          vm.list.del(data.user);
        m.redraw();
      });
      socket.on('user_disconnected', function(time, user) {
        vm.list.del(user.name).then(m.redraw);
      });
    }());
  };
  return vm;
}());