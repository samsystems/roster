'use strict';

angular.module('customer').controller('CustomerFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Customer', 'Country', 'State','$state',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, Customer, Country, State, $state) {

    $scope.countries = Country.$search();
    $scope.states    = State.$search();
    $scope.customer = {};

    if(!_.isUndefined($stateParams.id)){
       $scope.customer = Customer.$find($stateParams.id);
    }else{
       $scope.customer =  Customer.$build();
    }
    //
    $scope.save = function() {
    //    $validation.validate($scope, 'customer').success(function() {

            if(!_.isUndefined($scope.customer.Id)){
                $scope.customer.$save().$then(function(response) {
                    $rootScope.$broadcast('customer::updated');
                    toaster.pop('success', 'Customer Updated ', 'You have been successfully updated a customer.')
                    $state.go("app.customer");
                }, function() {
                    toaster.pop('error', 'Error', 'Something went wrong a new Customer could not be created');
                });
            } else {
                $scope.customer.$save().$then(function(response) {
                    $rootScope.$broadcast('customer::created');
                    toaster.pop('success', 'Customer Created', 'You have successfully created a new customer.');
                    $state.go("app.customer");
                }, function() {
                    toaster.pop('error', 'Error', 'Something went wrong a new Customer could not be created');
                });
            }
        //}).error(function() {
        //    toaster.pop('error', 'Error', 'Complete the required entry fields.');
        //});
    };
}]);