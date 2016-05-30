/* global m, usersViewElement */
'use strict';
var users = users || {};

/**
 * Users component - view
 */
users.view = function() {
  var usersList = users.vm.list.users();
  return [
    m("h6", [
      m("i", {class:'fa fa-users'}),
      m("span", usersList.length + " utilisateur" + (usersList.length > 1 ? 's':'') + " en ligne")
    ]),
    m("ul#clients", [
      usersList.map(function(user) {
        return m("li", {key:user.id(), class:user.status()}, [
          m("span", {class:'status ' + user.status()}),
          m("img", {
            class:'img-rounded',
            src:user.avatar(),
            alt:user.name(),
            title:user.name() + ' - ' + user.status()
          }),
          m("span", {class:'pseudo', style:{color:user.color()}}, user.name())
        ])
      })
    ])
  ]
};

/**
 * Component mounting
 */
m.mount(usersViewElement, { controller:users.controller, view:users.view });
