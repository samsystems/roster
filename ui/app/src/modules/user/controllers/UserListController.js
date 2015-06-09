'use strict';

angular.module('user').controller('UserListController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'User','ngTableParams','$filter','$q', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, User, ngTableParams,$filter, $q) {

    $scope.page = 1;
    $scope.searchUser = '';

    $scope.limitInPage = config.application.limitInPage;

    $scope.search = function(term) {
        $scope.userTable.reload()
    };

    $scope.refresh = function() {
        $scope.searchUser = '';
    };

    $scope.userTable = new ngTableParams({
        page: 1,            // show first page
        count: 5           // count per page
    }, {
        total: 0, // length of data
        getData: function($defer, params) {
            var sort = params.orderBy() != false ? params.orderBy() : 'notSorting';
            var users = null;
            if( !_.isUndefined($scope.searchUser) && $scope.searchUser != '') {
                users = User.$search({keyword: $scope.searchUser, page: params.page(), order: sort});
                $scope.total = User.$search({keyword: $scope.searchUser}).count();
            }
            else {
                users = User.$search({page: params.page(), order: sort});
                $scope.total = User.$search().count();
            }
            $q.all([users.$promise,$scope.total.$promise]).then(function(data){
                params.total($scope.total.count);
                $defer.resolve(data[0]);
            })
        }
    });

    $scope.$watch('searchUser', function(data) {
        $scope.search();
    });

    $rootScope.$on('user::created', function(event) {
        $scope.userTable.reload();
    });

    $rootScope.$on('user::updated', function(event) {
        $scope.userTable.reload();
    });

    $rootScope.$on('user::deleted', function($event) {
        $scope.userTable.reload();
    });

    $scope.removeUser = function(user) {
        dialogs.confirm('Remove a User', 'If you decide to delete this user, all the data ralated will be automatically deleted!' +
                '<br/> Are you sure you want to remove a User?').result.then(function(btn){
            user.$delete({id: user.id}, function (response) {
                $rootScope.$broadcast('user::deleted');
                toaster.pop('success', 'user Deleted', 'You have successfully deleted a user.')
            });
        });
    };


        $scope.showForm = function () {
            $scope.message = "Show Form Button Clicked";
            console.log($scope.message);

            var modalInstance = $modal.open({
                templateUrl: 'modal-form.html',
                controller: ModalInstanceCtrl,
                scope: $scope,
                resolve: {
                    userForm: function () {
                        return $scope.userForm;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
}]);


var ModalInstanceCtrl = function ($scope, $modalInstance, userForm) {
    $scope.form = {}
    $scope.submitForm = function () {
        if ($scope.form.userForm.$valid) {
            console.log('user form is in scope');
            $modalInstance.close('closed');
        } else {
            console.log('userform is not in scope');
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};