'use strict';

angular.module('conductorMhdApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/perform/:side', {
        templateUrl: 'app/perform/perform.html',
        controller: 'PerformCtrl'
      })
      .when('/perform', {
        redirectTo: '/perform/A'
      });
  });
