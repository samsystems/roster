'use strict';

angular.module('common').directive('page', [function(){
    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/page-directive.html',
        transclude: true
    };
}]);
