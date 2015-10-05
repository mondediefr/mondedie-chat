var socket = io();
var editor = null;

/**
 * Mithril namespaces
 */
var messages = messages || {};
var users = users || {};

/**
 * Views DOM anchors
 */
var messagesViewElement = document.getElementById("content-messages");
var usersViewElement = document.getElementById("content-users");