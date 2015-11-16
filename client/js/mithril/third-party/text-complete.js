/* global $, users */
'use strict';

$(function() {

  var option = {
    placement: 'top'
  };

  $.get('../json/emoji_strategy.json', function(emojiStrategy) {
    $("#text-editor").textcomplete([{
      // Auto-complétion des smileys
      match: /\B:([\-+\w]{2,})$/,
      search: function(term, callback) {
        var x = []; var y = []; var z = [];
        $.each(emojiStrategy,function(shortname, data) {
          if(shortname.indexOf(term) > -1)
            x.push(shortname);
          else {
            if((data.aliases !== null) && (data.aliases.indexOf(term) > -1))
              y.push(shortname);
            else if((data.keywords !== null) && (data.keywords.indexOf(term) > -1))
              z.push(shortname);
          }
        });
        if(term.length >= 3) {
          x.sort(function(a, b) { return (a.length > b.length); });
          y.sort(function(a, b) { return (a.length > b.length); });
          z.sort();
        }
        var results = x.concat(y).concat(z);
        callback(results);
      },
      template: function(shortname) {
        return '<img class="emojione" src="//cdn.jsdelivr.net/emojione/assets/png/' + emojiStrategy[shortname].unicode + '.png"> :' + shortname + ':';
      },
      replace: function(shortname) {
        return ':' + shortname + ': ';
      },
      index: 1
    },
    // Auto-complétion des pseudos
    {
      users: users.vm.list.users(),
      match: /\B@(\w*)$/,
      search: function(term, callback) {
        var mentions = $.map(this.users, function(user) {
          return user.name();
        });
        callback($.map(mentions, function(mention) {
          return mention.toLowerCase().indexOf(term.toLowerCase()) === 0 ? mention : null;
        }));
      },
      template: function(username) {
        var user = $.grep(this.users, function(user) {
          return user.name() === username;
        });
        return '<img class="emojione" src="' + user[0].avatar() + '"></img>' + username;
      },
      replace: function(username) {
        return '@' + username + ' ';
      },
      index: 1
    },
    // Auto-complétion des commandes
    {
      commands: ['poke @', 'msg @', 'roll', 'afk on|off'],
      match: /^\/(\w*)$/,
      search: function(term, callback) {
        callback($.map(this.commands, function(command) {
          return command.indexOf(term) === 0 ? command : null;
        }));
      },
      template: function(command) {
        return '/' + command;
      },
      replace: function(command) {
        return '/' + command;
      },
      index: 1
    }
    ], option);
  });
});
