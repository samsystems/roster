'use strict';

angular.module('common').controller('RegisterController', ['$scope', '$window', '$state', 'AuthenticationService', 'User', 'Industry', 'State', 'toaster', 'WizardHandler',
    function ($scope, $window, $state, AuthenticationService, User, Industry, State, toaster, WizardHandler) {
        $scope.user = {};
    $scope.credentials = {};

        $scope.states    = State.$search();

        $scope.step = {
            register1: 'register1',
            register2: 'register2'
        };

        $scope.industries         = Industry.$search();

        $scope.$goTo = function (step) {
            WizardHandler.wizard().goTo(step);
        };


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

        $scope.toStepTwo = function () {
            $scope.$goTo($scope.step.register2);
        };

        $scope.toStepOne = function () {
            $scope.$goTo($scope.step.register1);
        };


        $scope.save = function () {
                if (!_.isUndefined($scope.user) && $scope.user.Id) {

                    $scope.user.$save().$then(function(response) {
                        $rootScope.$broadcast('user::updated');
                        toaster.pop('success', 'User Updated ', 'You have been successfully updated a user.')
                        $scope.$goTo($scope.step.list);
                    }, function () {
                        toaster.pop('error', 'Error', 'Something went wrong a new User could not be created');
                    });
                } else {

                    var user = User.$build();
                    user.FirstName = $scope.user.FirstName;
                    user.LastName = $scope.user.LastName;
                    user.Email = $scope.user.Email;
                    user.Password = $scope.user.Password;
                    user.Business = $scope.user.BusinessName;
                    user.EmployerNumber = $scope.user.EmployerNumber;
                    user.Industry = $scope.user.Industry;
                    user.Address = $scope.user.StreetAddress;
                    user.Apto = $scope.user.AptUnit;
                    user.City = $scope.user.City;
                    user.State = $scope.user.State;
                    user.Zipcode = $scope.user.Zipcode;
                    user.DOB = $scope.user.DOB;
                    user.SSN = $scope.user.SSN;
                    user.Phone = $scope.user.Phone;


                    user.$save().$then(function (response) {
                        toaster.pop('success', 'User Created', 'You have successfully created a new user.');
                       // $state.go("login");
                    }, function () {
                        toaster.pop('error', 'Error', 'Something went wrong a new User could not be created');
                    });
                }
            //   }).error(function () {
            //       toaster.pop('error', 'Error', 'Complete the required entry fields.');
            //    });
        };
}]);