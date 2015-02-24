'use strict';

angular.module('common').directive('leftSidebar', ['$rootScope', function($rootScope){
    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/left-side-bar-directive.html',
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