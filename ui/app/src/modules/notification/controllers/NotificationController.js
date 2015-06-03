'use strict';

angular.module('notification').controller('NotificationController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Notification', 'User','ngTableParams', '$filter', 'SweetAlert', '$q',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Notification, User, ngTableParams, $filter, SweetAlert, $q) {

    $scope.page = 1;
    $scope.total = 0;
    $scope.search = {notification: ""};
    $scope.limitInPage      = config.application.limitInPage;

    $scope.search = function() {
        $scope.notificationTable.reload();
    };

    $scope.refresh = function() {
        $scope.search.notification = '';
    };

        $scope.notificationTable = new ngTableParams({
            page: 1,            // show first page
            count: 20           // count per page
        }, {
            total: 0, // length of data
            getData: function ($defer, params) {
                var notifications = Notification.$search({page: params.page(), sort: params.orderBy(), keyword: $scope.search.notification});
                var total = Notification.count($scope.search.notification);
                $q.all([notifications.$asPromise(), total]).then(function (data) {
                    $scope.total = data[1].data.total;
                    params.total(data[1].data.total);
                    $defer.resolve(data[0]);
                })
            }
        });


  /*  $scope.$watchGroup(['searchNotification' ,'page'], function(data) {
        if(data[0] != null && data[0] != '') {
            $scope.notifications = User.$new(User.getCurrentUserId()).notifications.$fetch({keyword: data[0], page: data[1]});
        }else{
            $scope.notifications = User.$new(User.getCurrentUserId()).notifications.$fetch({page: data[1]});
        }
        $scope.notificationTable.reload();
    });*/

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