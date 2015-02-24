'use strict';

angular.module('common').directive('leftSidebarToggle', ['$rootScope', function($rootScope){
    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/left-sidebar-toggle-directive.html',
        replace: true,
        link: function($scope) {

            $scope.toggle = function() {
                $rootScope.$broadcast('LeftSidebar::Toggle');
            };
        }
    };
}]);