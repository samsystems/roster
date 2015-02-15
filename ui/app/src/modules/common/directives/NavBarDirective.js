'use strict';

angular.module('common').directive('navBar', [function(){
    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/nav-bar-directive.html'
    };
}]);