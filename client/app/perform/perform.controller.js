'use strict';

angular.module('conductorMhdApp')
  .controller('PerformCtrl', function ($scope, $location, $routeParams, ntp, constants) {
    var side = $routeParams.side ? $routeParams.side : 'A';
  
    // If it's not a valid route param, just bail out to the main page
    if(!_.contains(constants.sides, side)) {
      $location.path('/');
    }

    $scope.side = side;
    var evaluateBestLatency = function() {
        var latency = ntp.getBestRoundtripLatency();
        $scope.pingLatency = latency;      
        return (latency < constants.maxLatency);
    };

    $scope.waitingForPing = false;
    
    ntp.startMeasurements();
    $scope.$on('ntp:update', function() {
      var goodEnough = evaluateBestLatency(); 
      $scope.waitingForPing = !goodEnough;
      if (goodEnough) {
        ntp.stopMeasurements();
      }
    });

    $scope.$on('$destroy', function() {
      ntp.stopMeasurements();
    });
  });
