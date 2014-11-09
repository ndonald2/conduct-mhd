/* global Tone */
'use strict';

angular.module('conductorMhdApp')
  .service('synth', function($rootScope) {
        
    // Constants
    var BPM = 100;
    var SECONDS_PER_16TH = (60.0 / BPM) / 4;
    var MILLIS_PER_SECOND = 1000;

    var Score = {
      'longTones' : [['0:0', 'A2'], ['0:1', 'A3'], ['0:2', 'A2'], ['0:3', 'A3']]
    };

    Tone.Note.parseScore(Score);  

    Tone.Note.route('longTones', function(time, note) {
      var beat = Tone.Transport.getTransportTime().split(':')[1];
      $rootScope.$broadcast('synth:beat', beat);
    });

    Tone.Transport.setLoopStart(0);
    Tone.Transport.setLoopEnd('1:0:0');
    Tone.Transport.loop = true;
    Tone.Transport.setBpm(BPM);

    function syncedTimeOffset(serverTime) {
      if (!serverTime) {
        return Tone.Transport.now();
      }
    }

    return {
      start: function(serverTime) {
        console.log('Starting synth');
        Tone.Transport.start(syncedTimeOffset(serverTime));
      },
      stop: function() {
        console.log('Stopping synth');
        Tone.Transport.stop();
      }
    };
  });
