/* global io */
'use strict';

var RoundTrip = function(serverResponse) {
    
    var clientSentTime = serverResponse.clientSentTime;
    var serverReceivedTime = serverResponse.serverReceivedTime;
    var clientReceivedTime = new Date().getTime();
    
    var self = {
      // how far ahead is the server of the client
      getTimeOffset: function(){
        return serverReceivedTime - (clientSentTime + self.getCommunicationLatency())
      },
      // how long did it take for a message to get from client to server
      getCommunicationLatency: function() {
        return (clientReceivedTime - clientSentTime) / 2;
      }
    };
    
    console.log("new RoundTrip. latency is: " + self.getCommunicationLatency() + " offset is: " + self.getTimeOffset());
    
    return self;
}

angular.module('conductorMhdApp')
  .factory('socket', function(socketFactory) {

    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    var roundtripCount = 0, 
      MAX_TRIPS = 1000, 
      currentServerTime = 0,
      fastestRoundTrip;

    return {
      socket: socket,
      
      startNTPMeasurements: function() {

        var initiateRoundTrip = function() {
          socket.emit('ntp', {timeStamp: new Date().getTime()});
        };

        socket.on('ntp', function(data){
          if(roundtripCount++ < MAX_TRIPS){
            setTimeout(function() {
              initiateRoundTrip();
            }, 500);
          }
          var trip = RoundTrip(data);
          if(!fastestRoundTrip || trip.getCommunicationLatency() < fastestRoundTrip.getCommunicationLatency()){
            fastestRoundTrip = trip;
          }
        });

        initiateRoundTrip();
      },

      getCurrentServerTime: function(){
        var timeOffset = fastestRoundTrip?  fastestRoundTrip.getTimeOffset() : 0;
        return new Date().getTime() + fastestRoundTrip.getTimeOffset();
      },

      getBestRoundtripLatency: function() {
        return fastestRoundTrip?  fastestRoundTrip.getCommunicationLatency() : -1;
      }
    };
  });
