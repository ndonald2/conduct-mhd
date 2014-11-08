/* global io */
'use strict';

angular.module('conductorMhdApp')
  .factory('socket', function(socketFactory) {

    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });
    
    return socket;
  });
