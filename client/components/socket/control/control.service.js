'use strict';

angular.module('conductorMhdApp')
  .factory('control', function($rootScope, socket) {

    socket.forward('control:assign');
    
    return {
      assign: function(side) {
        socket.emit('control:assign', {side: side});
      }
    };
  });
