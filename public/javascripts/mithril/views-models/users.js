/**
 * Users component - view-model
 */
users.vm = (function() {
  var vm = {};
  vm.init = function() {
    vm.list = new users.UsersList();
    vm.listen = (function () {
      socket.on('user_connected', function(user) {
        vm.list.push(new users.User({
          id:user.id,
          name:user.name,
          color:user.groupColor,
          avatar:user.avatar
        }));
        m.redraw();
      });
      socket.on('user_new', function(time, username) {
        vm.list.reinit();
        m.redraw();
      });
      socket.on('user_disconnected', function(time, user) {
        vm.list.del(user.id).then(m.redraw);
      });
    }());
  };
  return vm;
}());