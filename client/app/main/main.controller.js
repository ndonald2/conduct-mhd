'use strict';

angular.module('conductorMhdApp')
  .controller('MainCtrl', function ($scope, $location, ntp, constants) {
      
      var evaluateBestLatency = function() {
          var latency = ntp.getBestRoundtripLatency();
          var isGoodEnough = (latency < constants.maxLatency);
          $scope.pingLatency = latency;      
          return isGoodEnough;
      };

      var startPerforming = function(side) {
        $location.path('/perform/' + side);
      };

      ntp.startMeasurements();

      $scope.waitingForPing = false;
      $scope.sides = constants.sides; 
      $scope.perform = function(side) {

        if (evaluateBestLatency()) {
          startPerforming(side);
        }
        else {
          $scope.waitingForPing = true;
          $scope.$on('ntp:update', function() {
            evaluateBestLatency(); 
          });
        }
      };

      $scope.$on('$destroy', function() {
        ntp.stopMeasurements();
      });
  });
