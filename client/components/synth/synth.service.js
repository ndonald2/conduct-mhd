/* global Tone */
'use strict';

angular.module('conductorMhdApp')
  .service('synth', function($rootScope) {
        
    // IDEA: Don't use score at all
    // - Set transport to loop 16 bars
    // - Register interval for each instrument
    // - Peek at transport time and use that to index note info
    //   - Could even have helper functions to get note info for a given transport time 
    // - Can use measure index as shift if desired

    // Constants
    var BPM = 100;
    var NUM_ARPEGG_VOICES = 8;
    var SEQ_LENGTH_MEASURES = 24;
    var MILLIS_PER_SECOND = 1000;
    var SECONDS_PER_MEASURE = (60.0 / BPM) * 4;

    var scales = [];
    var baseScale = [0, 2,3,5, 7, 9, 10];
	  var offsets = [0, -5, 0, -5, 0, -1];

    var addScale = function(offset) {

		  var newScale = [];
		  for(var i = 0; i < baseScale.length; i++){
		    newScale.push(baseScale[i] + offset);
		  }
		  scales.push(newScale);
		};

		for(var i = 0; i < offsets.length; i++){  
      addScale(offsets[i]);
		}
	  
    var currentScale = 0;
    var scaleDegree = function(degree) {
      var octave = Math.floor(degree / scales[currentScale].length);
      var baseNumber = degree % scales[currentScale].length;
      return scales[currentScale][baseNumber] + 12 * octave;    
    };
    var sequences = [];
    //arpeggios (room side A)
    for(var seqIndex = 0; seqIndex < NUM_ARPEGG_VOICES; seqIndex++){
      var seq = [];
      sequences.push(seq);
      
      for(var section = 0; section < 2 * scales.length; section ++){
        if(section % 2 === 0){
          currentScale = (currentScale + 1) % scales.length;
        }
        for(var i = 0; i < 16; i++){
          if(i === seqIndex){
            seq.push(scaleDegree(i * 2));
          }else{
            seq.push('');
          }
        }
      }
    }
    // 'bass line' (room side B)
    currentScale = 0;
    var bassLine = [];
    for(var section = 0; section < 2 * scales.length; section ++){
      if(section % 2 === 0){
        currentScale = (currentScale + 1) % scales.length;
      }
      bassLine = bassLine.concat([scaleDegree(0), '', scaleDegree(0), '', scaleDegree(4), '', scaleDegree(0), '', '', '', '', '', '', '', '', '' ]);
    }
    
    sequences.push(bassLine);
    /////////////// NICK !!!! the sequences is in the sequences variable //////////////
    console.log(sequences);
    
    // ====================================================================
    // =                    play back the sequences                       =
    // ====================================================================
    
    var keys = new Tone.PolySynth(3, Tone.MonoSynth, {
    		'oscType' : 'sine',
    		'filter' : {
    			'Q' : 0,
    			'type' : 'lowpass',
    			'rolloff' : -24
    		},
    		'envelope' : {
    			'attack' : 0.005,
    			'decay' : 10 + Math.random() * 4,
    			'sustain' : 1,
    			'release' : 1 + Math.random() * 40
    		},
    		'filterEnvelope' : {
    			'attack' : 0.06,
    			'decay' : 10,
    			'sustain' : 1,
    			'release' : 2,
    			'min' : 20,
    			'max' : 4000
    		}
    	});
    
    var midiToFreq = function(midiNote){
      return 440 * Math.pow(2, (midiNote-69)/12);
    };
    
    //connect it to the master output
    keys.toMaster();
    
    var Score = {};
    		
    for(var i = 0; i < sequences.length; i++){
      var sequenceForThisVoice = sequences[i];
      var scoreForThisVoice = [];
      Score['keys' + i] = scoreForThisVoice;
      
      for(var step = 0; step < sequenceForThisVoice.length; step++){
        var thisStepVal = sequenceForThisVoice[step];
        if(thisStepVal !== ''){
          scoreForThisVoice.push(['0:0:' + step, [midiToFreq(70 + thisStepVal)]]);
        }
      }
      
      (function() {
        var voice = i;
        Tone.Note.route('keys' + i, function(time, value){
        			var velocity = 1;
        			for (var note = 0; note < value.length; note++) {
        			  console.log('voice ' + voice);
        				keys.triggerAttackRelease(value[note], '16n', time, velocity);
        			}
        		});
      })();
    }
    	
    Tone.Note.parseScore(Score);  

    Tone.Transport.setInterval(function() {
      var seqPos = Tone.Transport.getTransportTime();
      $rootScope.$broadcast('synth:beat', seqPos);
    }, '4n');

    Tone.Transport.setLoopStart(0);
    Tone.Transport.setLoopEnd(SEQ_LENGTH_MEASURES.toString() + ':0:0');
    Tone.Transport.loop = true;
    Tone.Transport.setBpm(BPM);

    function syncedTransportTime(serverTime) {
      if (!serverTime) {
        return 0;
      }
     
      var seqDur = SECONDS_PER_MEASURE * SEQ_LENGTH_MEASURES;
      var serverSeconds = serverTime / MILLIS_PER_SECOND;
      var modTime = Math.floor(serverSeconds/seqDur) * seqDur;
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
