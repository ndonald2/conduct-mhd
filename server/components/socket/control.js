'use strict';

var NUM_MELODY_PARTS = 8;
var lastPartAssigned = 0;

var registerSocket = function(socket) {
  socket.on('control:assign', function(data) {
    console.log('Assign sent ', data);
    var assignedVoices = {
      'sprinkles': 1
    };
    if (data.side === 'A') {
      assignedVoices.melody = lastPartAssigned;
      lastPartAssigned = (lastPartAssigned + 1) % NUM_MELODY_PARTS;
    } else if (data.side === 'B') {
      assignedVoices.bass = 1;
    }
    socket.emit('control:assign', assignedVoices); 
  });
};

module.exports = registerSocket;
