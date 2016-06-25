'use strict';
var smileys = smileys || {};
var emojiVersion = '?v=2.2.4';

/**
 * Smileys component - model
 */
(function () {
  smileys.list = {
    get:function() {
      return [
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f600.png'+ emojiVersion, pattern:':grinning:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f602.png'+ emojiVersion, pattern:':joy:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f603.png'+ emojiVersion, pattern:':smiley:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f607.png'+ emojiVersion, pattern:':innocent:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f609.png'+ emojiVersion, pattern:':wink:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f642.png'+ emojiVersion, pattern:':slight_smile:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f60b.png'+ emojiVersion, pattern:':yum:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f60d.png'+ emojiVersion, pattern:':heart_eyes:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f618.png'+ emojiVersion, pattern:':kissing_heart:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f61b.png'+ emojiVersion, pattern:':stuck_out_tongue:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f60e.png'+ emojiVersion, pattern:':sunglasses:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f610.png'+ emojiVersion, pattern:':neutral_face:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f644.png'+ emojiVersion, pattern:':rolling_eyes:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f914.png'+ emojiVersion, pattern:':thinking:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f61f.png'+ emojiVersion, pattern:':worried:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f621.png'+ emojiVersion, pattern:':rage:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f615.png'+ emojiVersion, pattern:':confused:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/2639.png'+ emojiVersion, pattern:':frowning2:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f62e.png'+ emojiVersion, pattern:':open_mouth:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f622.png'+ emojiVersion, pattern:':cry:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f62d.png'+ emojiVersion, pattern:':sob:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f608.png'+ emojiVersion, pattern:':smiling_imp:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f62b.png'+ emojiVersion, pattern:':tired_face:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f613.png'+ emojiVersion, pattern:':sweat:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f604.png'+ emojiVersion, pattern:':smile:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f60c.png'+ emojiVersion, pattern:':relieved:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f61c.png'+ emojiVersion, pattern:':stuck_out_tongue_winking_eye:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f620.png'+ emojiVersion, pattern:':angry:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f614.png'+ emojiVersion, pattern:':pensive:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f631.png'+ emojiVersion, pattern:':scream:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f628.png'+ emojiVersion, pattern:':fearful:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f635.png'+ emojiVersion, pattern:':dizzy_face:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f47f.png'+ emojiVersion, pattern:':imp:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f596.png'+ emojiVersion, pattern:':vulcan:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f595.png'+ emojiVersion, pattern:':middle_finger:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f630.png'+ emojiVersion, pattern:':cold_sweat:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f634.png'+ emojiVersion, pattern:':sleeping:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f44f.png'+ emojiVersion, pattern:':clap:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f4a9.png'+ emojiVersion, pattern:':poop:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f4a1.png'+ emojiVersion, pattern:':bulb:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f354.png'+ emojiVersion, pattern:':hamburger:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/2600.png'+ emojiVersion, pattern:':sunny:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f327.png'+ emojiVersion, pattern:':cloud_rain:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/26bd.png'+ emojiVersion, pattern:':soccer:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f6f0.png'+ emojiVersion, pattern:':satellite_orbital:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f680.png'+ emojiVersion, pattern:':rocket:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f4ee.png'+ emojiVersion, pattern:':postbox:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f4b6.png'+ emojiVersion, pattern:':euro:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f4b0.png'+ emojiVersion, pattern:':moneybag:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f4b3.png'+ emojiVersion, pattern:':credit_card:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/26d4.png'+ emojiVersion, pattern:':no_entry:' },
        { url:'//cdn.jsdelivr.net/emojione/assets/png/1f1eb-1f1f7.png'+ emojiVersion, pattern:':flag_fr:' },
        { url:'/images/smileys/hap.gif', pattern:':hap:' },
        { url:'/images/smileys/monkey-glass.png', pattern:':monkeyglass:' },
        { url:'/images/smileys/monkey-smile.png', pattern:':monkeysmile:' },
        { url:'/images/smileys/noel.gif', pattern:':noel:' },
        { url:'/images/smileys/kappa.png', pattern:':kappa:' },
        { url:'/images/smileys/bb8.png', pattern:':bb8:' },
        { url:'/images/smileys/saber.png', pattern:':saber:' },
        { url:'/images/smileys/kyloren.png', pattern:':kyloren:' },
        { url:'/images/smileys/troll.png', pattern:':troll:'}
      ]
    }
  };
})();
