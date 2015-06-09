'use strict';

angular.module('user').controller('UserFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'User', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, User) {

    $scope.user = {};

    if (!_.isUndefined($stateParams.id)) {
        $scope.user = User.$find($stateParams.id);

    } else {
        $scope.user = User.$build();
    }

    $scope.save = function(form) {
        $validation.validate(form).success(function() {

            if (!_.isUndefined($scope.user.Id)) {
                var user = $scope.user;

                $scope.user.$save().$then(function (response) {
                    $rootScope.$broadcast('user::updated');
                    toaster.pop('success', 'User Updated ', 'You have been successfully updated a user.')
                    $state.go("app.user");
                }, function () {
                    toaster.pop('error', 'Error', 'Something went wrong a new User could not be created');
                });
            } else {
                var user = User.$build();
                user.Username   = $scope.user.Username;
                user.Email      = $scope.user.Email;
                user.Password   = $scope.user.Password;
                user.FirstName  = $scope.user.FirstName;
                user.LastName   = $scope.user.LastName;
                user.Dob        = $scope.user.Dob;
                user.Address    = {};
                user.Country    = $scope.user.Country;
                user.Company    = $scope.user.Company;
                user.Group    = $scope.user.Group;

                if(!_.isUndefined($scope.user.Address.City)) {
                    user.address['city'] = $scope.user.Address.City;
                }
                if($scope.user.address.line1) {
                    user.address['line1'] = $scope.user.Address.Line1;
                }
                if($scope.user.address.line2) {
                    user.address['line2'] = $scope.user.Address.Line2;
                }
                if($scope.user.address.state) {
                    user.address['state'] = $scope.user.Address.State;
                }




                customer.$save().$then(function (response) {
                    $rootScope.$broadcast('customer::created');
                    toaster.pop('success', 'Customer Created', 'You have successfully created a new customer.');
                    $state.go("app.customer");
                }, function () {
                    toaster.pop('error', 'Error', 'Something went wrong a new Customer could not be created');
                });
            }
        }).error(function() {
            toaster.pop('error', 'Error', 'Complete the required entry fields.');
        });
    };
}]);