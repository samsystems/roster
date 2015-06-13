'use strict';

angular.module('user').controller('UserListController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'User', 'ngTableParams', '$filter', '$q', '$log', '$validation', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, User, ngTableParams, $filter, $q, $log, $validation) {

    $scope.page = 1;

    $scope.limitInPage = config.application.limitInPage;

    $scope.search = function (term) {
        $scope.userTable.reload()
    };

    $scope.refresh = function () {
        $scope.searchUser = '';
    };

    $scope.userTable = new ngTableParams({
        page: 1,            // show first page
        count: 5           // count per page
    }, {
        total: 0, // length of data
        getData: function ($defer, params) {
            var users = User.$search({page: params.page(), sort: params.orderBy(), keyword: $scope.searchUser});
            var total = User.count($scope.searchUser);
            $q.all([users.$asPromise(), total]).then(function (data) {
                $scope.total = data[1].data.total;
                params.total(data[1].data.total);
                $defer.resolve(data[0]);
            })


            /*     var sort = params.orderBy() != false ? params.orderBy() : 'notSorting';
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
             })*/
        }
    });

    $scope.$watch('searchUser', function (data) {
        $scope.search();
    });

    $rootScope.$on('user::created', function (event) {
        $scope.userTable.reload();
    });

    $rootScope.$on('user::updated', function (event) {
        $scope.userTable.reload();
    });

    $rootScope.$on('user::deleted', function ($event) {
        $scope.userTable.reload();
    });

    $scope.removeUser = function (user) {
        dialogs.confirm('Remove a User', 'If you decide to delete this user, all the data ralated will be automatically deleted!' +
            '<br/> Are you sure you want to remove a User?').result.then(function (btn) {
                user.$delete({id: user.id}, function (response) {
                    $rootScope.$broadcast('user::deleted');
                    toaster.pop('success', 'user Deleted', 'You have successfully deleted a user.')
                });
            });
    };

    $scope.setActive = function (user) {
        $scope.userSave = User.$find(user.Id).$then(function () {
            console.log($scope.userSave.IsActive);
            if ($scope.userSave.IsActive) {
                $scope.userSave.IsActive = false;
                var message = 'The user has successfully disabled';
            }
            else {
                $scope.userSave.IsActive = true;
                var message = 'The user has successfully activated';
            }

            console.log($scope.userSave.IsActive);
            $scope.userSave.$save().$then(function (response) {
                $rootScope.$broadcast('user::created');
                toaster.pop('success', 'User update', message);
                delete $scope.userSave;
            }, function () {
                toaster.pop('error', 'Error', 'Something went wrong');
                delete $scope.userSave;
            });
        });
    };

    /* var saveGroup = function (form) {
     $validation.validate(form).success(function() {
     $scope.user.$save().$then(function (response) {
     $rootScope.$broadcast('user::updated');
     toaster.pop('success', 'User Updated ', 'You have been successfully updated a user group.')
     //  $state.go("app.customer");
     }, function () {
     toaster.pop('error', 'Error', 'Something went wrong');

     });
     }).error(function() {
     toaster.pop('error', 'Error', 'Complete the required entry fields.');
     });
     };*/

    $scope.showFormAdd = function () {
        $scope.message = "Show Form Button Clicked";
        console.log($scope.message);
        $scope.userGuest = User.$build();
        var modalInstance = $modal.open({
            templateUrl: 'src/modules/user/views/user-modal.html',
            controller: ModalGuestUser,
            scope: $scope,
            resolve: {
                userGuestForm: function () {
                    return $scope.userGuestForm;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.showChangeGroup = function (user) {
        $scope.message = "Show Form Button Clicked";
        console.log($scope.message);
        $scope.user = User.$find(user.Id);
        var modalInstance = $modal.open({
            templateUrl: 'src/modules/user/views/change-group.html',
            controller: ModalChangeGroup,
            scope: $scope,
            resolve: {
                userChangeGroupForm: function () {
                    return $scope.userChangeGroupForm;
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


var ModalChangeGroup = function ($scope, $modalInstance, userChangeGroupForm, toaster, $rootScope) {
    $scope.form = {}
    $scope.submitChangeGroupForm = function () {
        if ($scope.form.userChangeGroupForm.$valid) {
            console.log('user form is in scope');
            $scope.user.$save().$then(function (response) {
                $rootScope.$broadcast('user::updated');
                toaster.pop('success', 'User Updated ', 'You have been successfully updated a user group.')
                //  $state.go("app.customer");
            }, function () {
                toaster.pop('error', 'Error', 'Something went wrong');

            });
            $modalInstance.close('closed');
        } else {
            console.log('userform is not in scope');
        }
    };

    $scope.cancelChangeGroup = function () {
        $modalInstance.dismiss('cancel');
    };
};


var ModalGuestUser = function ($scope, $modalInstance, userGuestForm, toaster, $rootScope, WorkerService, User, $validation, config) {
    $scope.form = {}
    $scope.submitGuestForm = function () {
        $validation.validate($scope.form.userGuestForm).success(function () {
            //  if ($scope.form.userGuestForm.$valid) {
            console.log('user form is in scope');
            $scope.userGuest.$save().$then(function (response) {
                $rootScope.$broadcast('user::updated');
                toaster.pop('success', 'User Updated ', 'You have been successfully invited a user.');
                console.log(response.Id);
                $scope.userGuest = User.$find(response.Id).$then(function () {
                    //var emailSend=$scope.userGuest.Email;
                    var emailSend = $scope.userGuest.Email,
                        dest = {},
                        subject = "hola",
                        body = config.api.baseUrl + "/#/guest-register/" + $scope.userGuest.Token;

                    dest[emailSend] = $scope.userGuest.getFullName();
                    WorkerService.sendMail(subject, dest, body);

                });
                //  $state.go("app.customer");
            }, function () {
                toaster.pop('error', 'Error', 'Something went wrong');

            });
            $modalInstance.close('closed');
        }).error(function () {
            toaster.pop('error', 'Error', 'Complete the required entry fields.');
        });

    };

    $scope.cancelGuest = function () {
        $modalInstance.dismiss('cancel');
    };
};