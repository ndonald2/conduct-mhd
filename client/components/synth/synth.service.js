/* global Tone */
'use strict';

angular.module('conductorMhdApp')
  .service('synth', [
      '$rootScope', 
      'synth.score', 
      'synth.instruments',
      function($rootScope, sequences, instruments) {

    // Local Constants
    var BPM = 120;
    var SEQ_LENGTH_MEASURES = 12;
    var MILLIS_PER_SECOND = 1000;
    var SECONDS_PER_MEASURE = (60.0 / BPM) * 4;

    // Variables
    var playingInstruments = {};
       		
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

    var buildScore = function(instrumentName, voiceIndexes) {
      instrumentName = instrumentName || 'melody';

      var instrument = instruments[instrumentName]; 
      var sequence = sequences[instrumentName];

      if (!instrument) {
        console.log('ERROR - not a real instrument: ', instrumentName);
        return;
      }

      voiceIndexes = voiceIndexes || (function() {
        var vis = [];
        for (var vi=0; vi<sequence.length; vi++) {
          vis.push(vi);
        }
        return vis;
      })();


      _.each(voiceIndexes, function(i) {
        var sequenceForThisVoice = sequence[i];
        var scoreForThisVoice = [];
        
        for(var step = 0; step < sequenceForThisVoice.length; step++){
          var thisStepVal = sequenceForThisVoice[step];
          if(thisStepVal !== ''){
            var freq = midiToFreq(50 + thisStepVal);
            freq = freq * (Math.random() * 0.015 + 1.0);
            scoreForThisVoice.push(['0:0:' + step, [freq]]);
          }
        }  
        var score = {};
        score[instrumentName] = scoreForThisVoice;
        Tone.Note.parseScore(score); 
      });

      var routeFunction = function(time, value) {
        for (var note = 0; note < value.length; note++) {
          instrument.triggerAttackRelease(value[note], '16n', time, 1.0);
        }
      };
      Tone.Note.route(instrumentName, routeFunction);
      playingInstruments[instrumentName] = instrument;

      if (instrumentName === 'sprinkles') {
        var feedbackDelay = new Tone.PingPongDelay(Math.random() * 0.2 + 0.2);
        //60% feedback
    		feedbackDelay.setFeedback(0.2);
    		//connections
    		instrument.connect(feedbackDelay);
    		feedbackDelay.toMaster();	
    		feedbackDelay.setWet(0.1);
      } else {
        instrument.toMaster();
      }
    };

    var resetInstruments = function() {
      playingInstruments = {};
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

    var setParam = function(name, value) {
      if (name.search(':') > 0) {
        var instName = name.split(':')[0];
        var paramName = name.split(':')[1];

        var inst = playingInstruments[instName];
        if (inst) {
          if (paramName === 'volume') {
            inst.setVolume(+value);  
          }
        }
      }
    };

    return {
      start: function(opts) {
        console.log('Starting synth with opts: ', opts);
        Tone.Transport.stop();
        resetInstruments();
        initTransport();

        // uncomment for 'dev mode' (all voices)
        //buildScore('melody');
        //buildScore('bass');
        //buildScore('sprinkles');
        
        _.forOwn(opts.voices, function(idx, name) {
          buildScore(name, [idx]);
        });

        var syncedTime = syncedTransportTime(opts.serverTime);
        Tone.Transport.setTransportTime(syncedTime);
        Tone.Transport.start();
      },
      stop: function() {
        console.log('Stopping synth');
        Tone.Transport.stop();
      },
      setParams: function(params) {
        _.forOwn(params, function(value, name) {
          setParam(name, value);
        });
      }
    };
  }]);
