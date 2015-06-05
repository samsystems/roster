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

        $scope.addContact = function(){
            $scope.vendor.contacts.$build().$reveal();
        }

        $scope.removeContact = function(contact){
            $scope.vendor.contacts.$remove(contact);
        }

        $scope.save = function (form) {
                $validation.validate(form).success(function() {
            var vendor = $scope.vendor;
            $scope.vendor.Contacts = [];
            var count = 0;
            for (var i = 0; i < vendor.contacts.length; i++) {
                if (vendor.contacts[i].Name) {
                    $scope.vendor.Contacts[count] = vendor.contacts[i];
                    count++;
                }
            }
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
                vendor.Location = $scope.vendor.Location;

                vendor.TrackTransaction = $scope.vendor.TrackTransaction;
                vendor.TaxId = $scope.vendor.TaxId;

                vendor.BankAccountName = $scope.vendor.BankAccountName;
                vendor.BankAccount = $scope.vendor.BankAccount;
                vendor.BatchPaymentsDetails = $scope.vendor.BatchPaymentsDetails;

                vendor.Contacts = [];
                var count = 0;
                for (var i = 0; i < $scope.vendor.contacts.length; i++) {
                    if($scope.vendor.contacts[i].Name)
                    {
                        vendor.Contacts[count] = $scope.vendor.contacts[i];
                        count++;
                    }
                }

                vendor.$save().$then(function (response) {
                    $rootScope.$broadcast('vendor::created');
                    toaster.pop('success', 'Vendor Created', 'You have successfully created a new vendor.');
                    $state.go("app.vendor");
                }, function () {
                    toaster.pop('error', 'Error', 'Something went wrong a new Vendor could not be created');
                });
            }
            }).error(function() {
                toaster.pop('error', 'Error', 'Complete the required entry fields.');
            });
        };
    }]);