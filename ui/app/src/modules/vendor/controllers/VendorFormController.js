'use strict';

angular.module('vendor').controller('VendorFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Vendor', 'Country', 'State', '$state',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, Vendor, Country, State, $state) {

        $scope.countries = Country.$search();
        $scope.states = State.$search();
        $scope.vendor = {};
        if (!_.isUndefined($stateParams.id)) {
            $scope.vendor = Vendor.$find($stateParams.id);
            $scope.vendor.contacts.$fetch();
        } else {
            $scope.vendor = Vendor.$build();
            $scope.vendor.contacts.$build().$reveal();
        }
        //

        $scope.addContact = function (index) {
            if (index == $scope.vendor.contacts.length - 1)
                $scope.vendor.contacts.$build().$reveal();
        }

        $scope.save = function () {
            //    $validation.validate($scope, 'vendor').success(function() {

            if (!_.isUndefined($scope.vendor.Id)) {
                $scope.vendor.$save().$then(function (response) {
                    $rootScope.$broadcast('vendor::updated');
                    toaster.pop('success', 'Vendor Updated ', 'You have been successfully updated a vendor.')
                    $state.go("app.vendor");
                }, function () {
                    toaster.pop('error', 'Error', 'Something went wrong a new Vendor could not be created');
                });
            } else {
                var vendor = Vendor.$build();
                vendor.Name = $scope.vendor.Name;
                vendor.Phone = $scope.vendor.Phone;
                vendor.Mobile = $scope.vendor.Mobile;
                vendor.Fax = $scope.vendor.Fax;
                vendor.CompanyName = $scope.vendor.CompanyName;
                vendor.WebSite = $scope.vendor.WebSite;
                vendor.AccountNumber = $scope.vendor.AccountNumber;
                vendor.Address = $scope.vendor.Address;
                vendor.Address1 = $scope.vendor.Address1;
                vendor.City = $scope.vendor.City;
                vendor.State = $scope.vendor.State;
                vendor.Zipcode = $scope.vendor.Zipcode;

                vendor.TaxId = $scope.vendor.TaxId;
                // vendor.Discount = $scope.vendor.Name;
                vendor.BankAccountName = $scope.vendor.BankAccountName;
                vendor.BankAccount = $scope.vendor.BankAccount;
                vendor.BatchPaymentsDetailt = $scope.vendor.BatchPaymentsDetailt;
                vendor.Contacts =  $scope.vendor.contacts;

                vendor.$save().$then(function (response) {
                    $rootScope.$broadcast('vendor::created');
                    toaster.pop('success', 'Vendor Created', 'You have successfully created a new vendor.');
                    $state.go("app.vendor");
                }, function () {
                    toaster.pop('error', 'Error', 'Something went wrong a new Vendor could not be created');
                });
            }
            //}).error(function() {
            //    toaster.pop('error', 'Error', 'Complete the required entry fields.');
            //});
        };
    }]);