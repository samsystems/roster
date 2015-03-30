'use strict';

angular.module('notification').controller('NotificationFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Notification', 'User', '$state', 'SweetAlert',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, Notification, User, $state, SweetAlert) {

    $scope.notification = Notification.$build();

    $scope.searchUsers = function(val) {
        return User.$search({keyword: val});
    };

    $scope.save = function(notificationForm) {
        $validation.validate(notificationForm).success(function() {

            $scope.notification.$save();

            $scope.notification.$on('after-create', function() {
                toaster.pop('success', 'Notification Created', 'You have successfully created a new notification.');
            });

            $scope.$on('after-update', function() {
                toaster.pop('success', 'Notification Created', 'You have successfully updated this notification.');
            });

            $scope.$on('after-save-error', function() {
                toaster.pop('error', 'Unknown Error', 'Oops! Something went wrong a new please try again');
            });

            $scope.notification.$on('after-save', function() {
                $state.go("app.notification");
            });

        }).error(function() {
            SweetAlert.swal({
                    title: "Invalid form",
                    text: "Please complete all required fields!",
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",confirmButtonText: "Ok, got it!",
                    closeOnConfirm: true
                }
            );
        });
    };
}]);