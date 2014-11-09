'use strict';

angular.module('conductorMhdApp')
  .controller('MainCtrl', function ($scope, constants) {
      
      $scope.sides = constants.sides; 

      $scope.perform = function(side) {
        console.log('Chose side: ', side);
      };
  });
