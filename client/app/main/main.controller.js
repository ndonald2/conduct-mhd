'use strict';

angular.module('conductorMhdApp')
  .controller('MainCtrl', function ($scope, $http, ntp) {

    ntp.startMeasurements();

  });
