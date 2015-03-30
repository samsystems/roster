'use strict';

angular.module('notification').controller('NotificationController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Notification', 'User','ngTableParams', '$filter', 'SweetAlert',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Notification, User, ngTableParams, $filter, SweetAlert) {

    $scope.page = 1;
    $scope.searchNotification = '';

    $scope.limitInPage      = config.application.limitInPage;
    $scope.total            = User.$new(User.getCurrentUserId()).notifications.$fetch().count();
    $scope.notifications    = $rootScope.notifications = User.$new(User.getCurrentUserId()).notifications.$fetch({page: $scope.page});

    $scope.setPage = function(page) {
        $scope.page = page;
    };

    $scope.search = function(term) {
        $scope.searchNotification = term;
    };

    $scope.refresh = function() {
        $scope.searchNotification = '';
    };

    $scope.notificationTable = new ngTableParams({
        page: 1,            // show first page
        count: 20          // count per page
    }, {
        total: 0, // length of data
        getData: function($defer, params) {
            $scope.notifications.$promise.then(function(){
                params.total($scope.notifications.length);
                var orderedData = params.sorting() ? $filter('orderBy')($scope.notifications, params.orderBy()) : $scope.notifications;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            })
        }
    });

    $scope.$watchGroup(['searchNotification' ,'page'], function(data) {
        if(data[0] != null && data[0] != '') {
            $scope.notifications = User.$new(User.getCurrentUserId()).notifications.$fetch({keyword: data[0], page: data[1]});
        }else{
            $scope.notifications = User.$new(User.getCurrentUserId()).notifications.$fetch({page: data[1]});
        }
        $scope.notificationTable.reload();
    });

    $rootScope.$on('notification::created', function(event) {
        $scope.notificationTable.reload();
    });

    $rootScope.$on('notification::updated', function(event) {
        $scope.notificationTable.reload();
    });

    $rootScope.$on('notification::deleted', function($event) {
        $scope.notificationTable.reload();
    });

    $scope.removeNotification = function(notification) {
        SweetAlert.swal({
                title: "Are you sure you want to remove this notification?",
                text: "This action will remove the selected notification!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm){
                if (isConfirm) {
                    notification.$destroy().$then(function() {
                        $scope.total = Notification.$search({user: User.userInSession().id}).count();
                        $rootScope.$broadcast('notification::deleted');

                        SweetAlert.swal("Notification Deleted!", "You have successfully deleted the selected notification", "success");
                    });
                }
            }
        );
    };


}]);