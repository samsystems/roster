'use strict';

angular.module('notification').controller('NotificationViewController', ['$scope', '$rootScope', 'dialogs', '$state', 'toaster', '$stateParams', 'config', 'DateTimeService', 'NotificationService', 'User', function ($scope, $rootScope, dialogs, $state, toaster, $stateParams, config, DateTimeService, NotificationService, User) {

    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
    $scope.notification = {};

    if(id != null){
        $scope.notification = NotificationService.$find(id, function(notification){
            if($scope.notification.readed == false){
                NotificationResource.read({id: id}, function(){
                    $rootScope.notifications = NotificationResource.findUnread({user: User.userInSession().id ,page : 1});
                });
            }
        });
    }


    $scope.removeNotification = function(notification) {
        dialogs.confirm('Remove a Notification', 'Are you sure you want to remove a Notification?').result.then(function(btn){
            notification.$delete({id: notification.id}, function (response) {
                $scope.total = NotificationResource.findCount({user: User.userInSession().id});
                $rootScope.$broadcast('notificationView::deleted');
                toaster.pop('success', 'Notification Deleted', 'You have successfully deleted a notification.')
            });
            $state.go("app.notification");
        });
    };

}]);