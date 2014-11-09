'use strict';

var registerSocket = function(socket) {
  socket.on('ntp', function(data) {
    console.log("ntp: " + data.timeStamp);
    
    socket.emit('ntp', {
      serverReceivedTime: new Date().getTime(),
      clientSentTime: data.timeStamp
    });
  });
};

module.exports = registerSocket; 
