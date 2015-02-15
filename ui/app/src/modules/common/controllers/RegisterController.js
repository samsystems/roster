'use strict';

angular.module('common').controller('RegisterController', ['$scope', '$window', '$state', 'AuthenticationService', 'User', 'toaster',
    function ($scope, $window, $state, AuthenticationService, User, toaster) {

    $scope.credentials = {};
    var userResource = User.resource;

    $scope.login = function (credentials) {

        if (credentials.username !== undefined && credentials.password !== undefined) {

            User.logIn(credentials.username, credentials.password)
                .success(function (data, status, headers, config) {
                    if(!_.isUndefined(data.token)) {
                        $window.sessionStorage.token        = data.token;
                        $window.sessionStorage.tokenExpires = data.expires;

                        userResource.findByName({username: credentials.username}, function(user) {
                            $window.sessionStorage.user = angular.toJson(user);
                        });

                        AuthenticationService.isLogged = true;
                        $state.go("app.dashboard");
                    }
                    else {
                        // Handle server errors
                        toaster.pop('error', 'Error', 'There was an error when trying to connect to the application. Please try again.');
                    }
                })
                .error(function (data, status, headers, config) {
                    // Erase the token if the user fails to log in
                    delete $window.sessionStorage.token;

                    // empty form
                    $scope.credentials.username = '';
                    $scope.credentials.password = '';

                    // Handle login errors
                    toaster.pop('error', 'Error' ,'Invalid user or password');
                });
        }
        else {
            toaster.pop('error', 'Error', 'Both username and password are required to login. Please try again.');
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