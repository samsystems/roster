'use strict';

angular.module('common').directive('navBarNotifications', ['User', function(User){
    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/nav-bar-notifications.html',
        replace: true,
        scope: true,
        link: function($scope, element, attr) {
            $scope.notifications = User.$new(User.getCurrentUserId()).notifications.$fetch({unread: true, page: 1});
        }
    };
}]);