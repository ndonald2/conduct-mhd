'use strict';

angular.module('conductorMhdApp')
  .controller('MainCtrl', function ($scope, $location, constants) {
      $scope.sides = constants.sides; 
      $scope.perform = function(side) {
        $location.path('/perform/' + side);
      };
  });
