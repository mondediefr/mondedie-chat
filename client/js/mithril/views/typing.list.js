/* global m, typingViewElement */
'use strict';
var typing = typing || {};

/**
 * Typing component - view
 */
typing.view = function() {
  var userList = typing.vm.list.users();
  var length = userList.length;
  return m("p", [
    userList.map(function(username, index) {
      return [ m("strong", username), conjunction(index, length) ];
    }),
    m("span", sentence(length))
  ])
};

/**
 * DOM methods
 */
function conjunction(index, length) {
  if(index === length - 1)
    return null;
  else if(index === length - 2)
    return ' et ';
  else
    return ', ';
}

function sentence(length) {
  if(!length)
    return null;
  return (length === 1 ? " est" : " sont") + " en train d'écrire...";
}

/**
 * Component mounting
 */
m.mount(typingViewElement, { controller:typing.controller, view:typing.view });