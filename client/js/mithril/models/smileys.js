'use strict';
var smileys = smileys || {};

/**
 * Smileys component - model
 */
(function () {
  smileys.list = {
    get:function() {
      return [
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f600.png?v=1.2.4', pattern:':grinning:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f602.png?v=1.2.4', pattern:':joy:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f603.png?v=1.2.4', pattern:':smiley:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f607.png?v=1.2.4', pattern:':innocent:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f609.png?v=1.2.4', pattern:':wink:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f642.png?v=1.2.4', pattern:':slight_smile:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f60b.png?v=1.2.4', pattern:':yum:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f60d.png?v=1.2.4', pattern:':heart_eyes:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f618.png?v=1.2.4', pattern:':kissing_heart:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f61b.png?v=1.2.4', pattern:':stuck_out_tongue:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f60e.png?v=1.2.4', pattern:':sunglasses:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f610.png?v=1.2.4', pattern:':neutral_face:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f644.png?v=1.2.4', pattern:':rolling_eyes:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f914.png?v=1.2.4', pattern:':thinking:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f61f.png?v=1.2.4', pattern:':worried:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f621.png?v=1.2.4', pattern:':rage:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f615.png?v=1.2.4', pattern:':confused:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/2639.png?v=1.2.4', pattern:':frowning2:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f62e.png?v=1.2.4', pattern:':open_mouth:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f622.png?v=1.2.4', pattern:':cry:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f62d.png?v=1.2.4', pattern:':sob:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f608.png?v=1.2.4', pattern:':smiling_imp:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f62b.png?v=1.2.4', pattern:':tired_face:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f613.png?v=1.2.4', pattern:':sweat:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f604.png?v=1.2.4', pattern:':smile:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f60c.png?v=1.2.4', pattern:':relieved:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f61c.png?v=1.2.4', pattern:':stuck_out_tongue_winking_eye:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f620.png?v=1.2.4', pattern:':angry:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f614.png?v=1.2.4', pattern:':pensive:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f631.png?v=1.2.4', pattern:':scream:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f628.png?v=1.2.4', pattern:':fearful:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f635.png?v=1.2.4', pattern:':dizzy_face:' },
        { url:'http://cdn.jsdelivr.net/emojione/assets/png/1f47f.png?v=1.2.4', pattern:':imp:' },
        { url:'/images/smileys/monkey-glass.png', pattern:':monkeyglass:' },
        { url:'/images/smileys/monkey-smile.png', pattern:':monkeysmile:' },
        { url:'/images/smileys/noel.gif', pattern:':noel:' },
        { url:'/images/smileys/kappa.png', pattern:':kappa:' },
        { url:'/images/smileys/hap.gif', pattern:':hap:' }
      ]
    }
  };
})();