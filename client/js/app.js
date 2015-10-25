/* global document, io */
'use strict';
var socket = io();

/**
 * Mithril namespaces
 */
var messages = messages || {};
var users    = users    || {};
var smileys  = smileys  || {};

/**
 * Views DOM anchors
 */
var messagesViewElement = document.getElementById("content-messages");
var usersViewElement    = document.getElementById("content-users");
var smileysViewElement  = document.getElementById("content-smileys");
var typingViewElement   = document.getElementById("content-typing");

/**
 * DOM elements
 */
var textarea = document.getElementById('text-editor');