/* global m, smileysViewElement, textarea */
'use strict';
var smileys = smileys || {};

/**
 * Smileys component - view
 */
smileys.view = function(controller) {
  return m(".smileys-container", [
    controller.smileys.map(function(smiley) {
      return m("img", {
        src:smiley.url,
        class:'emojione',
        title:smiley.pattern,
        onclick:m.withAttr("title", insertEmoji)
      });
    })
  ])
};

/**
 * DOM methods
 */
function insertEmoji(pattern) {
  textarea.value = textarea.value + ' ' + pattern;
  textarea.focus();
}

/**
 * Component mounting
 */
m.mount(smileysViewElement, { controller:smileys.controller, view:smileys.view });
