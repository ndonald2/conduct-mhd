'use strict';

angular.module('conductorMhdApp')
  .controller('PerformCtrl', function ($scope, $location, $routeParams, synth, control, ntp, constants) {
    
    function evaluateBestLatency() {
        var latency = ntp.getBestRoundtripLatency();
        $scope.pingLatency = latency;      
        return (latency < constants.maxLatency);
    }

    var side = $routeParams.side ? $routeParams.side : 'A';
  
    // If it's not a valid route param, just bail out to the main page
    if(!_.contains(constants.sides, side)) {
      $location.path('/');
    }

    $scope.side = side;
    $scope.maxLatency = constants.maxLatency;
    $scope.waitingForPing = true;
    $scope.playing = false;
   
    var assignedVoices;

    $scope.$on('socket:control:assign', function(e, data) {
      assignedVoices = data;
      ntp.startMeasurements();
    });

    $scope.$on('socket:control:update', function(e, data) {
      console.log('Got control update: ', data);
    });

    control.assign(side);

    $scope.$on('ntp:update', function() {
      var goodEnough = evaluateBestLatency(); 
      $scope.waitingForPing = !goodEnough;
      if (goodEnough) {
        ntp.stopMeasurements();
      }
    });

    $scope.playIt = function() {
      synth.start({
        serverTime: ntp.getCurrentServerTime(),
        voices: assignedVoices
      });
      control.sync();
      $scope.playing = true;
    };

    $scope.$on('synth:beat', function(e, seqPos) {
      $scope.beatNum = seqPos;
      $scope.$apply();
    });

    $scope.$on('$destroy', function() {
      ntp.stopMeasurements();
      synth.stop();
    });
  });
