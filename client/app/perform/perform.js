'use strict';

angular.module('conductorMhdApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/perform', {
        templateUrl: 'app/perform/perform.html',
        controller: 'PerformCtrl'
      });
  });
