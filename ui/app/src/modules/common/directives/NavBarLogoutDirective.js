'use strict';

angular.module('common').directive('navBarLogout', [function(){


    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/nav-bar-logout-directive.html',
        replace: true,
        link: function($scope) {
            $scope.logout = function() {

            };
        }
    };

}]);
