/**
 * Messages component - controller
 */
messages.controller = function() {
  messages.vm.load().then(messages.vm.initsockets);
};