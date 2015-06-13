'use strict';

angular.module('user').controller('GuestRegisterController', ['$scope', '$window', '$state', 'AuthenticationService', 'User', 'Company', 'CompanyScope', 'Industry', 'State', 'toaster', 'WizardHandler', '$validation','$stateParams',
    function ($scope, $window, $state, AuthenticationService, User, Company, CompanyScope, Industry, State, toaster, WizardHandler, $validation,$stateParams) {

        var token = (!_.isUndefined($stateParams.token)) ? $stateParams.token : null;

        if(token==null){
            toaster.pop('error', 'Error', 'There was an error when trying to connect to the application. Please try again.');
            $state.go("app.login");
        }

        $scope.user =  User.$build();
        User.$search({token:token}).$asPromise().then(function (users) {
            if (_.isUndefined(users[0])){
                toaster.pop('error', 'Error', 'There was an error when trying to connect to the application. Please try again.');
                $state.go("app.login");
            }
            $scope.user= User.$find(users[0].Id);
        });

       // $scope.credentials = {};

       // $scope.states = State.$search();
       // $scope.companies = Company.$search({page: 0, order: 'name'});
      //  $scope.companyScopes = CompanyScope.$search();

        $scope.save = function (guestRegisterForm) {
            $validation.validate(guestRegisterForm).success(function () {
                //var user = $scope.user;
                //console.log($scope.user.Id);
                $scope.user.IsActive= true;
                $scope.user.$save().$then(function (response) {
                    toaster.pop('success', 'User Created', 'You have successfully created a new user.');
                  //  $state.go("login");
                }, function () {
                    toaster.pop('error', 'Error', 'Something went wrong a new User could not be created');
                });
            }).error(function () {
                toaster.pop('error', 'Error', 'Complete the required entry fields.');
            });
        };
    }]);