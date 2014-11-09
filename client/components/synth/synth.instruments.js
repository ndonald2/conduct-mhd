/*global Tone*/
'use strict';

angular.module('conductorMhdApp')
  .factory('synth.instruments', function() {

  var release = 2 + Math.random() * 20;
  var melodySynth = new Tone.PolySynth(3, Tone.MonoSynth, {
    		'oscType' : 'square',
    		'filter' : {
    			'Q' : 0,
    			'type' : 'lowpass',
    			'rolloff' : -24
    		},
    		'envelope' : {
    			'attack' : 0.005,
    			'decay' : 1,
    			'sustain' : 0,
    			'release' : release
    		},
    		'filterEnvelope' : {
    			'attack' : 2,
    			'decay' : 10,
    			'sustain' : 0,
    			'release' : release,
    			'min' : 20,
    			'max' : 4000
    		}
    	});

    
    var bassSynth = new Tone.PolySynth(3, Tone.MonoSynth, {
      		'oscType' : 'square',
      		'filter' : {
      			'Q' : 0,
      			'type' : 'lowpass',
      			'rolloff' : -24
      		},
      		'envelope' : {
      			'attack' : 0.005,
      			'decay' : 1,
      			'sustain' : 0,
      			'release' : 1
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
      	
    var sprinklesSynth = new Tone.PolySynth(3, Tone.MonoSynth, {
        		'oscType' : 'square',
        		'filter' : {
        			'Q' : 0,
        			'type' : 'lowpass',
        			'rolloff' : -24
        		},
        		'envelope' : {
        			'attack' : 0.005,
        			'decay' : 0.1,
        			'sustain' : 0,
        			'release' : 0.1
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

    return {
      melody: melodySynth,
      bass: bassSynth,
      sprinkles: sprinklesSynth
    };
  });
