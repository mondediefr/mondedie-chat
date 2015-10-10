/**
 * Smileys component - view
 */
smileys.view = function(controller) {
  return m(".smileys-container", [
    controller.smileys.map(function(smiley) {
      return m("img", {
        src:smiley.url,
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
  editor.value(editor.value() + ' ' + pattern);
}

/**
 * Component mounting
 */
m.mount(smileysViewElement, { controller:smileys.controller, view:smileys.view });