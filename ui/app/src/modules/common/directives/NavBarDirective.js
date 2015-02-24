'use strict';

angular.module('common').directive('navBar', ['$rootScope', function($rootScope){
    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/nav-bar-directive.html',
        scope: true,
        link: function($scope) {
            $scope.ui = {
                collapsed: false
            };

            $rootScope.$on('LeftSidebar::Toggle', function() {
                $scope.ui.collapsed = !$scope.ui.collapsed;
            });
        }
    };
}]);