/* global SimpleMDE */

$(function(){

  /**
  * Markdown editor
  */
  editor = new SimpleMDE({
    autofocus: true,
    autosave: {
      enabled: true,
      unique_id: 'chatForm',
      delay: 1000
    },
    toolbar: [
      'bold', 'italic', 'strikethrough', '|', 'code', 'quote', 'unordered-list',
      'horizontal-rule', '|', 'link', 'image', '|', 'preview', 'side-by-side', 'fullscreen'
    ],
    indentWithTabs: false,
    renderingConfig: {
      codeSyntaxHighlighting: true,
    },
    spellChecker: false,
    status: false,
    tabSize: 4,
    toolbarTips: false
  });

});