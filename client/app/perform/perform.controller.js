'use strict';

angular.module('conductorMhdApp')
  .controller('PerformCtrl', function ($scope, $location, $routeParams) {

    var VALID_SIDES = ['A', 'B'];
    var side = $routeParams.side ? $routeParams.side : 'A';
  
    // If it's not a valid route param, just bail out to the main page
    if(!_.contains(VALID_SIDES, side)) {
      $location.path('/');
    }

  });
