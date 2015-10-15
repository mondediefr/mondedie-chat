'use strict';
var smileys = smileys || {};

/**
 * Smileys component - model
 */
(function () {
  smileys.list = {
    get:function() {
      return [
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F600.png?v=1.2.4', pattern:':grinning:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F602.png?v=1.2.4', pattern:':joy:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F604.png?v=1.2.4', pattern:':smile:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F605.png?v=1.2.4', pattern:':sweat_smile:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F606.png?v=1.2.4', pattern:':laughing:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F607.png?v=1.2.4', pattern:':innocent:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F609.png?v=1.2.4', pattern:':wink:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F610.png?v=1.2.4', pattern:':neutral_face:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F612.png?v=1.2.4', pattern:':unamused:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F615.png?v=1.2.4', pattern:':confused:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F618.png?v=1.2.4', pattern:':kissing_heart:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F626.png?v=1.2.4', pattern:':frowning:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F60B.png?v=1.2.4', pattern:':yum:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F60D.png?v=1.2.4', pattern:':heart_eyes:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F60E.png?v=1.2.4', pattern:':sunglasses:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F62E.png?v=1.2.4', pattern:':open_mouth:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F62D.png?v=1.2.4', pattern:':sob:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F621.png?v=1.2.4', pattern:':rage:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1F61D.png?v=1.2.4', pattern:':stuck_out_tongue_closed_eyes:' },
        { url:'/images/smileys/aviator.png', pattern:':aviator:' },
        { url:'/images/smileys/smile.png', pattern:':smilee:' },
        { url:'/images/smileys/wink.png', pattern:':winkk:' },
        { url:'/images/smileys/plain.png', pattern:':plain:' },
        { url:'/images/smileys/sad.png', pattern:':sad:' },
        { url:'/images/smileys/surprise.png', pattern:':surprise:' },
        { url:'/images/smileys/confused.png', pattern:':confusedd:' },
        { url:'/images/smileys/eek.png', pattern:':eek:' },
        { url:'/images/smileys/grin.png', pattern:':grinn:' },
        { url:'/images/smileys/kiss.png', pattern:':kisss:' },
        { url:'/images/smileys/angel.png', pattern:':angell:' },
        { url:'/images/smileys/cool.png', pattern:':coool:' },
        { url:'/images/smileys/crying.png', pattern:':crying:' },
        { url:'/images/smileys/razz.png', pattern:':razz:' },
        { url:'/images/smileys/monkey-glass.png', pattern:':monkeyglass:' },
        { url:'/images/smileys/monkey-smile.png', pattern:':monkeysmile:' },
        { url:'/images/smileys/noel.gif', pattern:':noel:' },
        { url:'/images/smileys/kappa.png', pattern:':kappa:' },
        { url:'/images/smileys/hap.gif', pattern:':hap:' }
      ]
    }
  };
})();