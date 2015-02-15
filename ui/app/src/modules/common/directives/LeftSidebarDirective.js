'use strict';

angular.module('common').directive('leftSidebar', [function(){
    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/left-side-bar-directive.html'
    };
}]);