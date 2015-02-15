'use strict';

angular.module('customer').controller('CustomerFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Customer', 'Country', 'State', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, Customer, Country, State) {

    $scope.countries = Country.$search();
    $scope.states    = State.$search();

    $scope.save = function() {
        $validation.validate($scope, 'customer').success(function() {

            if(!_.isUndefined($scope.customer.id)){
                $scope.customer.$update({id: $scope.customer.id}, function(response) {
                    $rootScope.$broadcast('customer::updated');
                    toaster.pop('success', 'Customer Updated ', 'You have been successfully updated a customer.')
                });
            }else{

                var customer = new customerResource();
                customer.name = $scope.customer.name;
                customer.category = $scope.customer.category;
                customer.phone = $scope.customer.phone;
                customer.mobile = $scope.customer.phone;
                customer.fax = $scope.customer.fax;
                customer.email = $scope.customer.email;
                customer.address = $scope.customer.address;
                customer.city = $scope.customer.city;
                customer.zipcode = $scope.customer.zipcode;
                customer.state = $scope.customer.state;
                customer.country = $scope.customer.country;
                customer.notes = $scope.customer.notes;

                customer.$save({}, function(response) {
                    $rootScope.$broadcast('customer::created');
                    toaster.pop('success', 'Customer Created', 'You have successfully created a new customer.');
                }, function() {
                    toaster.pop('error', 'Error', 'Something went wrong a new Customer could not be created');
                });
            }
            $scope.$goTo($scope.step.list);
        }).error(function() {
            toaster.pop('error', 'Error', 'Complete the required entry fields.');
        });
    };
}]);