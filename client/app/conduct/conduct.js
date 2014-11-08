'use strict';

angular.module('conductorMhdApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/conduct', {
        templateUrl: 'app/conduct/conduct.html',
        controller: 'ConductCtrl'
      });
  });
