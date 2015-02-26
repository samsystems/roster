'use strict';

angular.module('common').controller('RegisterController', ['$scope', '$window', '$state', 'AuthenticationService', 'User', 'Industry', 'toaster', 'WizardHandler',
    function ($scope, $window, $state, AuthenticationService, User, Industry, toaster, WizardHandler) {

    $scope.credentials = {};
    var userResource = User.resource;

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
                if (!_.isUndefined($scope.user.Id) && $scope.user.Id) {

                    $scope.user.$save().$then(function(response) {
                        $rootScope.$broadcast('user::updated');
                        toaster.pop('success', 'User Updated ', 'You have been successfully updated a user.')
                        $scope.$goTo($scope.step.list);
                    }, function () {
                        toaster.pop('error', 'Error', 'Something went wrong a new User could not be created');
                    });
                } else {

                    var user = User.$build();
                   /* invoice.Customer = {'Id':$scope.invoice.Customer.Id};
                    invoice.CustomerShipping = {'Id':$scope.invoice.CustomerShipping.Id};
                    // invoice.Date = $scope.invoice.Date;
                    invoice.DeliveryInstruction = $scope.invoice.DeliveryInstruction;
                    //  invoice.DeliveryDate = $scope.invoice.DeliveryDate;

                    invoice.ReferenceNumber = $scope.invoice.ReferenceNumber;
                    invoice.Currency = $scope.invoice.Currency;
                    invoice.InvoiceProducts = $scope.invoice.InvoiceProducts;
                    invoice.Status = status;
*/
                    user.$save().$then(function (response) {
                        $rootScope.$broadcast('user::updated');
                        toaster.pop('success', 'User Created', 'You have successfully created a new user.');
                        $scope.$goTo($scope.step.list);
                    }, function () {
                        toaster.pop('error', 'Error', 'Something went wrong a new User could not be created');
                    });
                }
            //   }).error(function () {
            //       toaster.pop('error', 'Error', 'Complete the required entry fields.');
            //    });
        };
}]);