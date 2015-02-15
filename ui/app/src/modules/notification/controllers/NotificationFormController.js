'use strict';

angular.module('notification').controller('NotificationFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'NotificationService', 'User', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, NotificationService, User) {

    var notificationResource = NotificationService.resource;
    var userResource         = User.resource;

    $scope.searchUsers = function(val) {
        return userResource.findByKeyword({keyword: val, page: 1}).$promise.then(function(users){
            return users;
        });
    };
    $scope.save = function() {
        if(_.isObject($scope.notification.owner)){
            $validation.validate($scope, 'notification').success(function() {

                if(!_.isUndefined($scope.notification.id)){
                    $scope.notification.$update({id: $scope.notification.id}, function(response) {
                        $rootScope.$broadcast('notification::updated');
                        toaster.pop('success', 'Notification Updated ', 'You have been successfully updated a notification.')
                    });
                }else{

                    var notification = new notificationResource();
                    notification.title = $scope.notification.title;
                    notification.category = $scope.notification.category;
                    notification.owner = $scope.notification.owner;

                    notification.$save({}, function(response) {
                        $rootScope.notifications = notificationResource.findUnread({user: User.userInSession().id ,page : 1});
                        $rootScope.$broadcast('notification::created');
                        toaster.pop('success', 'Notification Created', 'You have successfully created a new notification.');
                    }, function() {
                        toaster.pop('error', 'Error', 'Something went wrong a new Notification could not be created');
                    });
                }

                $scope.$goTo($scope.step.list);
            }).error(function() {
                toaster.pop('error', 'Error', 'Complete the required entry fields.');
            });
        }
        else{
            toaster.pop('error', 'Error', 'Please add a valid recipient.');
        }
    };
}]);