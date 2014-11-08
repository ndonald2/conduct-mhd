'use strict';

angular.module('conductorMhdApp')
  .controller('MainCtrl', function ($scope, $http, socket) {

    socket.startNTPMeasurements();
  });
