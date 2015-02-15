'use strict';

angular.module('common').directive('pageContent', [function(){
    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/page-content-directive.html',
        transclude: true
    };
}]);
