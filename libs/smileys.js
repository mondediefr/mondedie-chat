"use strict";
var smileys = require('./smileys.json');

var Smileys = function() {
  this.smileys = smileys;
  mapping(this.smileys);
}

Smileys.prototype.replace = function(message) {
  var _this = this;
  var regex = new RegExp(Object.keys(this.smileys).join("|"),"gi");
  return message.replace(regex, function(matched) {
    return _this.smileys[matched];
  });
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
