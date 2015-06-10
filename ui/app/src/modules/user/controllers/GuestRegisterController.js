'use strict';

angular.module('user').controller('GuestRegisterController', ['$scope', '$window', '$state', 'AuthenticationService', 'User', 'Company', 'CompanyScope', 'Industry', 'State', 'toaster', 'WizardHandler', '$validation',
    function ($scope, $window, $state, AuthenticationService, User, Company, CompanyScope, Industry, State, toaster, WizardHandler, $validation) {
        $scope.user = {};
        $scope.credentials = {};

        $scope.states = State.$search();
        $scope.companies = Company.$search({page: 0, order: 'name'});
        $scope.companyScopes = CompanyScope.$search();


        $scope.login = function (credentials) {

            if (credentials.username !== undefined && credentials.password !== undefined) {

                User.logIn(credentials.username, credentials.password)
                    .success(function (data, status, headers, config) {
                        if (!_.isUndefined(data.token)) {
                            $window.sessionStorage.token = data.token;
                            $window.sessionStorage.tokenExpires = data.expires;

                            userResource.findByName({username: credentials.username}, function (user) {
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
                        toaster.pop('error', 'Error', 'Invalid user or password');
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


        $scope.save = function (guestRegisterForm) {
            $validation.validate(guestRegisterForm).success(function () {
                var user = User.$build();
                user.FirstName = $scope.user.FirstName;
                user.LastName = $scope.user.LastName;
                user.Email = $scope.user.Email;
                user.Password = $scope.user.Password;
                user.DOB = $scope.user.DOB;
                user.SSN = $scope.user.SSN;
                user.Phone = $scope.user.Phone;


                user.$save().$then(function (response) {
                    toaster.pop('success', 'User Created', 'You have successfully created a new user.');
                    $state.go("login");
                }, function () {
                    toaster.pop('error', 'Error', 'Something went wrong a new User could not be created');
                });
            }).error(function () {
                toaster.pop('error', 'Error', 'Complete the required entry fields.');
            });
        };
    }]);