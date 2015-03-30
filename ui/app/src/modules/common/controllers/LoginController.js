'use strict';

angular.module('common').controller('LoginController', ['$scope', '$rootScope', '$window', '$state', 'AuthenticationService', 'User', 'toaster', 'Notification', 'SweetAlert',
    function ($scope, $rootScope, $window, $state, AuthenticationService, User, toaster, Notification, SweetAlert) {

        $scope.credentials = {};

        $scope.login = function (credentials) {

            if (credentials.username !== undefined && credentials.password !== undefined) {

                User.logIn(credentials.username, credentials.password)
                    .success(function (data, status, headers, config) {
                        if(!_.isUndefined(data.Token)) {
                            $window.sessionStorage.token        = data.Token;
                            $window.sessionStorage.tokenExpires = data.Expires;

                            User.$search({username: credentials.username}).$then(function(users) {
                                $window.sessionStorage.userId = users[0].getId();
                                $rootScope.userLogin = users[0];

                                $rootScope.notifications = User.$find(users[0].getId()).notifications.$fetch({ page : 1});

                                AuthenticationService.isLogged = true;
                                $state.go("app.dashboard");
                            });
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
                        SweetAlert.swal({
                            title:  "Error",
                            text:   "Invalid user or password",
                            type:   "error"
                        }, function(){
                            credentials.username = '';
                            credentials.password = '';

                            angular.element('#username').focus();
                        });
                    });
            }
            else {
                SweetAlert.swal({
                        title: "Error",
                        text: "Both username and password are required to login. Please try again.",
                        type: "error"
                }, function(){
                    angular.element('#username').focus();
                });
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