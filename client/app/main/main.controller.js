'use strict';

angular.module('conductorMhdApp')
  .controller('MainCtrl', function ($scope, ntp) {

    ntp.startMeasurements();

    $scope.$on('$destroy', function() {
      ntp.stopMeasurements();
    });

  });
