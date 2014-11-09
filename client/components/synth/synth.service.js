/* global Tone */
'use strict';

angular.module('conductorMhdApp')
  .service('synth', function($rootScope) {
        
    // Constants
    var BPM = 100;
    var MILLIS_PER_SECOND = 1000;
    var SECONDS_PER_MEASURE = (60.0 / BPM) * 4;

    // IDEA: Don't use score at all
    // - Set transport to loop 16 bars
    // - Register interval for each instrument
    // - Peek at transport time and use that to index note info
    //   - Could even have helper functions to get note info for a given transport time 
    // - Can use measure index as shift if desired

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

    function syncedTransportTime(serverTime) {
      if (!serverTime) {
        return 0;
      }
      
      var serverSeconds = serverTime / MILLIS_PER_SECOND;
      var modTime = Math.floor(serverSeconds/SECONDS_PER_MEASURE) * SECONDS_PER_MEASURE;
      return serverSeconds - modTime;
    }

    return {
      start: function(serverTime) {
        console.log('Starting synth');
        var syncedTime = syncedTransportTime(serverTime);
        Tone.Transport.setTransportTime(syncedTime);
        Tone.Transport.start();
      },
      stop: function() {
        console.log('Stopping synth');
        Tone.Transport.stop();
      }
    };
  });
