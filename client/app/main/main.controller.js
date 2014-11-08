'use strict';

angular.module('conductorMhdApp')
  .controller('MainCtrl', function ($scope, $http, socket) {

    socket.socket.emit('ntp', {timeStamp: new Date().getTime() });
    socket.socket.on('ntp', function(data) {
      console.log('ntp :', data.serverReceivedTime);
    });
    //$http.get('/api/things').success(function(awesomeThings) {
    //  $scope.awesomeThings = awesomeThings;
    //  socket.syncUpdates('thing', $scope.awesomeThings);
    //});

    //$scope.$on('$destroy', function () {
    //  socket.unsyncUpdates('thing');
    //});
  });
