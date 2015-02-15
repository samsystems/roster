'use strict';

angular.module('vendor').controller('VendorFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Vendor', 'Country', 'State', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, Vendor, Country, State) {

    $scope.countries = Country.$search();
    $scope.states    = State.$search();

    $scope.save = function() {
        $validation.validate($scope, 'vendor').success(function() {

            if(!_.isUndefined($scope.vendor.id)){
                $scope.vendor.$update({id: $scope.vendor.id}, function(response) {
                    $rootScope.$broadcast('vendor::updated');
                    toaster.pop('success', 'Vendor Updated ', 'You have been successfully updated a vendor.')
                });
            }else{

                var vendor = new vendorResource();
                vendor.name = $scope.vendor.name;
                vendor.category = $scope.vendor.category;
                vendor.phone = $scope.vendor.phone;
                vendor.fax = $scope.vendor.fax;
                vendor.email = $scope.vendor.email;
                vendor.address = $scope.vendor.address;
                vendor.city = $scope.vendor.city;
                vendor.zipcode = $scope.vendor.zipcode;
                vendor.state = $scope.vendor.state;
                vendor.country = $scope.vendor.country;
                vendor.notes = $scope.vendor.notes;

                vendor.$save({}, function(response) {
                    $rootScope.$broadcast('vendor::created');
                    toaster.pop('success', 'Vendor Created', 'You have successfully created a new vendor.');
                }, function() {
                    toaster.pop('error', 'Error', 'Something went wrong a new Vendor could not be created');
                });
            }
            $scope.$goTo($scope.step.list);
        }).error(function() {
            toaster.pop('error', 'Error', 'Complete the required entry fields.');
        });
    };
}]);