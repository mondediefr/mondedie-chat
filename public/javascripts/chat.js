/* global hljs */
/* global SimpleMDE */

$(function(){

  var socket = io();

  // ========================= SOCKET EVENTS =========================

  socket.once('connect', function() {

    socket.on('ping', function( data ) {
      socket.emit('pong', { beat: 1 });
    });

    socket.on('user_new', function() {
      $("ul#clients").text("");
    });

    socket.on('user_connected', function( user ) {
      $("ul#clients").append('<li style="color:' + user.groupColor + ';" class="' + user.id + '"> <img class="img-circle" src="' + user.avatar + '">' + user.name + '</li>');
    });

    socket.on('user_disconnected', function( userid ) {
      $("ul#clients li." + userid).remove();
    });

    socket.on('already_connected', function() {
      alert('Vous êtes déjà connecté, connexion au chat impossible !');
    });

    socket.on('user_banned', function() {
      alert('Impossible de se connecter au chat, vous avez été banni.');
    });

    socket.on('user_notfound', function() {
      alert('Utilisateur introuvable...');
    });

    socket.on('ban', function() {
      location.reload();
    });

    initMessageList(function() {
      socket.on('message', function( time, user, message ) {
        addMessage( time, user, message );
      });

      socket.on('botMessage', function( time, message ) {
        addBotMessage( time, message );
      });
    });

  });

  socket.on('disconnect', function() {
    addWarningMessage('Vous êtes déconnecté du chat !');
  });

  socket.on('reconnecting', function( attempt ) {
    if( attempt == 1 )
      addWarningMessage('Tentative de connexion au serveur en cours...');
    else if( attempt == 10 )
      addErrorMessage('Impossible de rétablir la connexion avec le serveur, recharger la page ou réessayer ultérieurement.');
  });

  socket.on('reconnect', function() {
    addSuccessMessage('Connexion au chat réussie !');
  });

  socket.on('error', function() {
    addErrorMessage('Une erreur est survenue lors de la connexion au serveur, recharger la page ou réessayer ultérieurement.');
  });

  // ========================= EDITOR =========================

  var editor = new SimpleMDE({
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

  // ========================= PAGE EVENT =========================

  $('.form-chat').submit(function( e ) {
    send(editor.value());
    editor.value('');
    e.preventDefault();
  });

  $('#banLink').click(function( e ) {
    $('#banPopup').modal();
    e.preventDefault();
  });

  $('#banPopup').find('button[role="ban"]').click(function( e ) {
    var username = $('input[name="userBanned"]').val();
    socket.emit('ban', username);
    $('#banPopup').modal('hide');
    e.preventDefault();
  });

  $('#banPopup').find('button[role="unban"]').click(function( e ) {
    var username = $('input[name="userBanned"]').val();
    socket.emit('unban', username);
    $('#banPopup').modal('hide');
    e.preventDefault();
  });

  // ========================= FUNCTIONS =========================

  var initMessageList = function( callback ) {
    $.get('/get/messages', function( data ) {
      $.each(data.messages, function( index, message ) {
        if( ! message.user )
          addBotMessage( message.time, message.message );
        else
          addMessage( message.time, message.user, message.message );
      });
      callback();
    }, 'json');
  };

  var send = function( message ) {
    socket.emit('message', message);
  };

  var addMessage = function( time, user, message ) {
    // Bug !
    // if( ! document.hasFocus() ) {
    //   titleNotification.on("Nouveau(x) message(s) !");
    // }
    $('#messages').append('<li class="message">(' + time + ') <b><span style="color:' + user.groupColor + ';">' + user.name + '</span>:</b> ' + message + '</li>');
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
  };

  var addBotMessage = function( time, message ) {

    $('#messages').append('<li class="message-bot">(' + time + ') <b>CHATBOT:</b> ' + message + '</li>');
    $("#messages").scrollTop($("#messages")[0].scrollHeight);

  };

  var addErrorMessage = function( message ) {

    $('#messages').append('<li class="message-error"><b>ERREUR:</b> ' + message + '</li>');
    $("#messages").scrollTop($("#messages")[0].scrollHeight);

  };

  var addWarningMessage = function( message ) {

    $('#messages').append('<li class="message-warning"><b>ATTENTION:</b> ' + message + '</li>');
    $("#messages").scrollTop($("#messages")[0].scrollHeight);

  };

  var addSuccessMessage = function( message ) {

    $('#messages').append('<li class="message-success"><b>INFO:</b> ' + message + '</li>');
    $("#messages").scrollTop($("#messages")[0].scrollHeight);

  };

  /*
  var titleNotification = {
    properties:{
      originalTitle:document.title,
      interval:null
    },
    on:function( notification ) {
      var _this = this;
      _this.properties.interval = setInterval(function() {
        document.title = ( _this.properties.originalTitle == document.title )
        ? notification
        : _this.properties.originalTitle;
      }, 1000);
      setTimeout(function() {
        clearInterval( _this.properties.interval );
        document.title = _this.properties.originalTitle;
      }, 6000);
    }
  };
  */

});