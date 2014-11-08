'use strict';

angular.module('conductorMhdApp')
  .controller('MainCtrl', function ($scope, ntp) {

    ntp.startMeasurements();

  });
