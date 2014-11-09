'use strict';

angular.module('conductorMhdApp')
  .directive('modal', function() {
    return {
      restrict: 'E',
      scope: {
        //'visible': '='
      },
      templateUrl: function(elem, attr){
        return 'components/modal/modal-'+attr.type+'.html';
      },
      transclude: true
    };
  });
