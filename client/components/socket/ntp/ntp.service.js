'use strict';

var RoundTrip = function(serverResponse) {
    
    var clientSentTime = serverResponse.clientSentTime;
    var serverReceivedTime = serverResponse.serverReceivedTime;
    var clientReceivedTime = new Date().getTime();
  
    var _this = this;

    this.getTimeOffset = function(){
        return serverReceivedTime - (clientSentTime + _this.getCommunicationLatency());
    };
    
    // how long did it take for a message to get from client to server
    this.getCommunicationLatency = function() {
        return (clientReceivedTime - clientSentTime) / 2;
    };
    
    console.log('new RoundTrip. latency is: ' + _this.getCommunicationLatency() + ' offset is: ' + _this.getTimeOffset());
    
    return this;
};

angular.module('conductorMhdApp')
  .factory('ntp', function($rootScope, socket) {

    var roundtripCount = 0, 
      MAX_TRIPS = 1000, 
      fastestRoundTrip;

    var initiateRoundTrip = function() {
      socket.emit('ntp', {timeStamp: new Date().getTime()});
    };
    return {
      startMeasurements: function() {

        socket.on('ntp', function(data){
          if(roundtripCount++ < MAX_TRIPS){
            setTimeout(function() {
              initiateRoundTrip();
            }, 500);
          }
          var trip = new RoundTrip(data);
          if(!fastestRoundTrip || trip.getCommunicationLatency() < fastestRoundTrip.getCommunicationLatency()){
            fastestRoundTrip = trip;
            $rootScope.$broadcast('ntp:update');
          }
        });

        initiateRoundTrip();
      },

      stopMeasurements: function() {
        socket.removeAllListeners('ntp');
      },
      
      getCurrentServerTime: function(){
        var timeOffset = fastestRoundTrip ? fastestRoundTrip.getTimeOffset() : 0;
        return new Date().getTime() + timeOffset; 
      },

      getBestRoundtripLatency: function() {
        return fastestRoundTrip?  fastestRoundTrip.getCommunicationLatency() : -1;
      }
    };
  });
