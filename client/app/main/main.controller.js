'use strict';

angular.module('conductorMhdApp')
  .controller('MainCtrl', function ($scope, $location) {
      $scope.perform = function(side) {
        $location.path('/perform/' + side);
      };
  });
