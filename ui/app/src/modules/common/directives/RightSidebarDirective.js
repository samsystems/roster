'use strict';

angular.module('common').directive('rightSidebar', [function(){
    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/right-sidebar-directive.html'
    };
}]);