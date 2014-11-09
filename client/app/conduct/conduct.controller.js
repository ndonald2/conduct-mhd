'use strict';

angular.module('conductorMhdApp')
  .controller('ConductCtrl', function ($scope, control) {

    $scope.controlsReady = false;

    var controls = {
      'melody:volume': { id: 'melody:volume', name: 'Melody Volume', min: -100, max: 0, value: -6 },
      'bass:volume': { id: 'bass:volume', name: 'Bass Volume', min: -100, max: 0, value: -6 },
      'sprinkles:volume': { id: 'sprinkles:volume', name: 'Sprinkle Volume', min: -100, max: 0, value: -6 }
    };

    $scope.controls = _.values(controls); 
    $scope.changed = function(id) {
      var diff = {};
      diff[id] = controls[id].value;
      control.update(diff); 
    };

    $scope.$on('socket:control:update', function(e, data) {
      console.log('Controls updated:', data);
    });

    control.sync();
  });
