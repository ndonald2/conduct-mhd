'use strict';

angular.module('conductorMhdApp')
  .factory('control', function($rootScope, socket) {

    socket.forward('control:update');
    socket.forward('control:assign');
    
    return {
      assign: function(side) {
        socket.emit('control:assign', {side: side});
      },
      sync: function() {
        socket.emit('control:sync');
      },
      update: function(data) {
        socket.emit('control:update', data);
      }
    };
  });
