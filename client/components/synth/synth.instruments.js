/*global Tone*/
'use strict';

angular.module('conductorMhdApp')
  .factory('synth.instruments', function() {

    var melody = new Tone.PolySynth(3, Tone.MonoSynth, {
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

    return {
      melody: melody
    };
  });
