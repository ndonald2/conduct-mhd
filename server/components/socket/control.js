'use strict';

var _ = require('lodash');

var NUM_MELODY_PARTS = 8;
var lastPartAssigned = 0;

var controlState = {
  'melody:volume' : -10,
  'bass:volume': -6,
  'sprinkles:volume': -100
};

var registerSocket = function(socket) {

  console.log('Socket registered for controls');

  socket.on('control:sync', function() {
    socket.emit('control:update', controlState);
  });

  socket.on('control:update', function(data) {
    _.forOwn(controlState, function(val, key) {
      if (data[key]) {
        controlState[key] = data[key]; 
      }
    });
    console.log('new control state: ', controlState);
    socket.broadcast.emit('control:update', controlState);
  });

  socket.on('control:assign', function(data) {
    var assignedVoices = {
      'sprinkles': 0 
    };
    if (data.side === 'A') {
      assignedVoices.melody = lastPartAssigned;
      lastPartAssigned = (lastPartAssigned + 1) % NUM_MELODY_PARTS;
    } else if (data.side === 'B') {
      assignedVoices.bass = 0;
    }
    socket.emit('control:assign', assignedVoices); 
    console.log('Client assigned to: ', assignedVoices);
  });
};

module.exports = registerSocket;
