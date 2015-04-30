'use strict';

angular.module('common').directive('sidebarUserInfo', ['User', function(User){
    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/sidebar-user-info-directive.html',
        replace: true,
        scope: true,
        link: function ($scope, element, attr) {
            $scope.user = User.$find(User.getCurrentUserId());
            $scope.logout = function () {
                User.logOut();
            };
        }
    };
}]);