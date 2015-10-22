/* global $, document, messages, SimpleMDE */
'use strict';
var editor = editor || {};

$(function(){

  /**
  * Markdown editor
  */
  editor = new SimpleMDE({
    element: document.getElementById('text-editor'),
    autofocus: true,
    autosave: {enabled: false},
    toolbar: [
      'bold', 'italic', 'strikethrough',
      '|', 'code', 'quote', 'unordered-list',
      '|', 'link', 'image', '|', 'preview', 'side-by-side', 'fullscreen',
      '|', {name: 'smiley', action: toggleSmiley, className: "fa fa-smile-o", title: "smiley (Ctrl+d)"}
    ],
    indentWithTabs: false,
    renderingConfig: {
      codeSyntaxHighlighting: true,
    },
    spellChecker: false,
    status: false,
    tabSize: 4,
    toolbarTips: true
  });

  editor.codemirror.on('keyHandled', function(instance, key) {
    if(key == 'Enter' && ! document.getElementById('disable-enter-action').checked) {
      if(instance.getValue().length > 1)
        messages.vm.send();
      else
        editor.value('');
    }
  });

  function toggleSmiley() {
    return console.log('do something...');
  }

});
