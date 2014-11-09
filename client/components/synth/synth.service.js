/* jshint quotmark: false*/
/* global Tone */
'use strict';

angular.module('conductorMhdApp')
  .service('synth', function() {
         
	  var baseScale = [0,2,3,5,7,9,10];
	  
	  var scales = [];
	  
	  var addScale = function(offset) {
	    var newScale = [];
	    for(var i = 0; i < baseScale.length; i++){
	      newScale.push(baseScale[i] + offset);
	    }
	    scales.push(newScale);
	  };

	  var offsets = [0, -5, 0, -5, 0, -1];
	  for(var i = 0; i < offsets.length; i++){  
  	  addScale(offsets[i]);
	  }
	  
    var currentScale = 0;

    var scaleDegree = function(degree) {
      var octave = Math.floor(degree / scales[currentScale].length);
      var baseNumber = degree % scales[currentScale].length;
      return scales[currentScale][baseNumber] + 12 * octave;    
    };


    var NUM_ARPEGG_VOICES = 8;

    var sequences = [];
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


    /////////////// NICK !!!! the sequences is in the sequences variable //////////////

    console.log(sequences);
    
    // ====================================================================
    // =                    play back the sequences                       =
    // ====================================================================
    
    var keys = new Tone.PolySynth(3, Tone.MonoSynth, {
    		"oscType" : "sine",
    		"filter" : {
    			"Q" : 0,
    			"type" : "lowpass",
    			"rolloff" : -24
    		},
    		"envelope" : {
    			"attack" : 0.005,
    			"decay" : 10 + Math.random() * 4,
    			"sustain" : 1,
    			"release" : 1 + Math.random() * 40
    		},
    		"filterEnvelope" : {
    			"attack" : 0.06,
    			"decay" : 10,
    			"sustain" : 1,
    			"release" : 2,
    			"min" : 20,
    			"max" : 4000
    		}
    	});
    
    var midiToFreq = function(midiNote){
      return 440 * Math.pow(2, (midiNote-69)/12);
    };
    
    
    //connect it to the master output
    keys.toMaster();
    
    var secsPer16th = 0.2;
    
    var Score = {};
    		
    for(var i = 0; i < NUM_ARPEGG_VOICES; i++){
      var sequenceForThisVoice = sequences[i];
      var scoreForThisVoice = [];
      Score["keys" + i] = scoreForThisVoice;
      
      for(var step = 0; step < sequenceForThisVoice.length; step++){
        var thisStepVal = sequenceForThisVoice[step];
        if(thisStepVal !== ""){
          scoreForThisVoice.push([step * secsPer16th, [midiToFreq(50 + thisStepVal)]]);
        }
      }
      
      (function() {
        Tone.Note.route("keys" + i, function(time, value){
        			var velocity = 1;
        			for (var note = 0; note < value.length; note++) {
        				keys.triggerAttackRelease(value[note], "16n", time, velocity);
        			}
        		});
        		
      })();
    }
    	
    //create events for all of the notes
    Tone.Note.parseScore(Score);
    Tone.Transport.setLoopStart(0);
    Tone.Transport.setLoopEnd( secsPer16th * sequences[0].length  );
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
