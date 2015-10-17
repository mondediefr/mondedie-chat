/* global m, usersViewElement */
'use strict';
var users = users || {};

/**
 * Users component - view
 */
users.view = function() {
  return m("ul#clients", [
    users.vm.list.users().map(function(user, i) {
      return m("li", { class:user.status(), style:{ color:user.color() }}, [
        m("img", { class:'img-rounded', src:user.avatar(), alt:user.name() }),
        user.name()
      ])
    })
  ])
};

/**
 * Component mounting
 */
m.mount(usersViewElement, { controller:users.controller, view:users.view });
