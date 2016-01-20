"use strict";
var smileys  = require('./smileys.json');
var emojione = require('emojione');

emojione.ascii = true;

var Smileys = function() {
  this.smileys = smileys;
  mapping(this.smileys);
}

Smileys.prototype.replace = function(message) {
  var _this = this;
  var regex = new RegExp(Object.keys(this.smileys).join("|"),"gi");
  message = jedeConversion(message);
  return message.replace(regex, function(matched) {
    return _this.smileys[matched];
  });
}

var jedeConversion = function(message) {
  message = message.replace(/(\:\))+/g, '<img src="/images/smileys/smile.png" class="emojione" alt="smile" title="smile"></img>');
  message = message.replace(/(\^\^)+/g, '<img src="/images/smileys/slight_smile.png" class="emojione" alt="smile" title="smile"></img>')
  return emojione.shortnameToImage(message);
}

var mapping = function(smileys) {
  for(var smiley in smileys) {
    if(smileys.hasOwnProperty(smiley)) {
      var filename = smileys[smiley];
      smileys[smiley] = '<img src="/images/smileys/' + filename + '" class="emojione" alt="' + smiley + '" title="' + smiley + '"></img>';
    }
  }
}

module.exports = Smileys;
