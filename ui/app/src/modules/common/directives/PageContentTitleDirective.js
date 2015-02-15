'use strict';

angular.module('common').directive('pageContentTitle', [function(){
    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/page-content-title-directive.html',
        scope: {
            title: '@title',
            description: '@description'
        },
        transclude: true
    };
}]);
