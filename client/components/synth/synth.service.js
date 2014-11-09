/* jshint quotmark: false*/
/* global Tone */
'use strict';

angular.module('conductorMhdApp')
  .service('synth', function() {
         
    Tone.Transport.setLoopStart(0);
    Tone.Transport.setLoopEnd("16:0");
    Tone.Transport.loop = true;
    Tone.Transport.setBpm(100);

    return {
      start: function() {
        console.log('Starting synth');
        Tone.Transport.start();
      },
      stop: function() {
        console.log('Stopping synth');
        Tone.Transport.stop();
      }
    };
  });
