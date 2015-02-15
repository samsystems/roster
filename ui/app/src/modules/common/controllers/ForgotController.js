'use strict';

angular.module('common').controller('ForgotController', ['$scope', '$window', '$state', 'AuthenticationService', 'User', 'toaster',
    function ($scope, $window, $state, AuthenticationService, User, toaster) {

        $scope.credentials = {};
        var userResource = User.resource;

        $scope.forgot = function (credentials) {
            if (credentials.email !== undefined) {
                User.forgot(credentials.email)
                    .success(function (data, status, headers, config) {
                        if (!_.isUndefined(data.email)) {
                            toaster.pop('info', 'Info', 'Your password has been reset successfully. Please check your email.');
                        }
                        else {
                            // Handle server errors
                            toaster.pop('error', 'Error', 'There was an error when trying to connect to the application. Please try again.');
                        }
                    })
                    .error(function (data, status, headers, config) {
                        if (status == 500) {
                            toaster.pop('error', 'Error', 'An error has occurred. Please try again.');
                            toaster.pop('error', 'Error', data.detail);
                        }
                        else
                            toaster.pop('error', 'Error', 'Invalid email');
                    });
                // Erase the token if the user fails to log in
                delete $window.sessionStorage.token;

                // empty form
                $scope.credentials.email = '';
            }
            else {
                toaster.pop('error', 'Error', 'Email is required to reset password. Please try again.');
            }
        };

        $scope.logout = function () {
            if (AuthenticationService.isLogged) {
                AuthenticationService.isLogged = false;
                delete $window.sessionStorage.token;
                delete $window.sessionStorage.tokenExpires;

                $state.go("login");
            }
        };

    }]);