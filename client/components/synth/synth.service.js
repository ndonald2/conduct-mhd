/* global Tone */
'use strict';

angular.module('conductorMhdApp')
  .service('synth', [
      '$rootScope', 
      'synth.score', 
      'synth.instruments',
      function($rootScope, sequences, instruments) {

    // Local Constants
    var BPM = 100;
    var SEQ_LENGTH_MEASURES = 12;
    var MILLIS_PER_SECOND = 1000;
    var SECONDS_PER_MEASURE = (60.0 / BPM) * 4;
       		
    // Functions
    var midiToFreq = function(midiNote){
      return 440 * Math.pow(2, (midiNote-69)/12);
    };

    var initTransport = function() {

      Tone.Transport.clearTimelines();
      Tone.Transport.clearIntervals();

      Tone.Transport.setLoopStart(0);
      Tone.Transport.setLoopEnd(SEQ_LENGTH_MEASURES.toString() + ':0:0');
      Tone.Transport.loop = true;
      Tone.Transport.setBpm(BPM);

      Tone.Transport.setInterval(function() {
        var seqPos = Tone.Transport.getTransportTime();
        $rootScope.$broadcast('synth:beat', seqPos);
      }, '4n');
    };

    var buildScore = function(instrumentName, voiceIdx) {
      var Score = {}; 

      var instrument = instruments[instrumentName]; 
      var sequence = sequences[instrumentName];

      var sequenceForThisVoice = sequence[voiceIdx];
      var scoreForThisVoice = [];
      Score[instrumentName + voiceIdx] = scoreForThisVoice;
      
      for(var step = 0; step < sequenceForThisVoice.length; step++){
        var thisStepVal = sequenceForThisVoice[step];
        if(thisStepVal !== ''){
          scoreForThisVoice.push(['0:0:' + step, [midiToFreq(70 + thisStepVal)]]);
        }
      }
        
      Tone.Note.route(instrumentName + voiceIdx, function(time, value) {
        for (var note = 0; note < value.length; note++) {
          instrument.triggerAttackRelease(value[note], '16n', time, 1.0);
        }
      });

      instrument.setVolume(-6);
      instrument.toMaster();
      Tone.Note.parseScore(Score); 
    };

    var resetInstruments = function() {
      _.each(instruments, function(instrument) {
        instrument.disconnect();
      });
    };

    var syncedTransportTime = function(serverTime) {
      if (!serverTime) {
        return 0;
      }
     
      var seqDur = SECONDS_PER_MEASURE * SEQ_LENGTH_MEASURES;
      var serverSeconds = serverTime / MILLIS_PER_SECOND;
      var modTime = Math.floor(serverSeconds/seqDur) * seqDur;
      return serverSeconds - modTime;
    };

    return {
      start: function(serverTime) {
        console.log('Starting synth');
        resetInstruments();
        initTransport();
        buildScore('melody', 0);
        buildScore('melody', 2);
        var syncedTime = syncedTransportTime(serverTime);
        Tone.Transport.setTransportTime(syncedTime);
        Tone.Transport.start();
      },
      stop: function() {
        console.log('Stopping synth');
        Tone.Transport.stop();
      }
    };
  }]);
