'use strict';

angular.module('user').controller('UserFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'User', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, User) {

    var userResource = User.resource;

    $scope.save = function() {
        $validation.validate($scope, 'user').success(function() {

            if(!_.isEmpty($scope.user.password) && !_.isEmpty($scope.user.passwordConfirm) && $scope.user.password != $scope.user.passwordConfirm){
                toaster.pop('error', 'Error', 'Password doesn\'t match.');
                return false;
            }

            if(!_.isUndefined($scope.user.id)){
                $scope.user.$update({id: $scope.user.id}, function(response) {
                    $rootScope.$broadcast('user::updated');
                    toaster.pop('success', 'Updated a User Record', 'You Have Successfully Updated a User Record.')
                });
            }else{

                var user        = new userResource();
                user.username   = $scope.user.username;
                user.email      = $scope.user.email;
                user.password   = $scope.user.password;
                user.firstName  = $scope.user.firstName;
                user.lastName   = $scope.user.lastName;
                user.dob        = $scope.user.dob;
                user.address    = {};
                user.country    = $scope.user.country;
                user.company    = $scope.user.company;
                user.group    = $scope.user.group;

                if(!_.isUndefined($scope.user.address.city)) {
                    user.address['city'] = $scope.user.address.city;
                }
                if($scope.user.address.line1) {
                    user.address['line1'] = $scope.user.address.line1;
                }
                if($scope.user.address.line2) {
                    user.address['line2'] = $scope.user.address.line2;
                }
                if($scope.user.address.state) {
                    user.address['state'] = $scope.user.address.state;
                }
                user.$save({}, function(response) {
                    $rootScope.$broadcast('user::created');
                    toaster.pop('success', 'Created a User', 'You have successfully created a new user.');
                }, function() {
                    toaster.pop('error', 'Error', 'Something went wrong a new User could not be created');
                });
            }
            $scope.$goTo($scope.step.list);
        }).error(function() {
            toaster.pop('error', 'Error', 'Complete the required entry fields.');
        });

    }; // end of ok function
}]);