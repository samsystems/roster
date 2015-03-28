'use strict';

angular.module('customer').controller('CustomerFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Customer', 'Country', 'State', '$state',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, Customer, Country, State, $state) {

        $scope.countries = Country.$search();
        $scope.states = State.$search();
        $scope.customer = {};

        if (!_.isUndefined($stateParams.id)) {
            $scope.customer = Customer.$find($stateParams.id).$then(function () {
                if ($scope.customer.ShippingLocation!=null && $scope.customer.BillingLocation!=null)
                    if ($scope.customer.ShippingLocation.Address == $scope.customer.BillingLocation.Address &&
                        $scope.customer.ShippingLocation.Address1 == $scope.customer.BillingLocation.Address1 &&
                        $scope.customer.ShippingLocation.City == $scope.customer.BillingLocation.City &&
                        $scope.customer.ShippingLocation.State.Id == $scope.customer.BillingLocation.State.Id &&
                        $scope.customer.ShippingLocation.Zipcode == $scope.customer.BillingLocation.Zipcode) {
                        $scope.customer.BillShip = true;
                    }
                $scope.customer.contacts.$fetch().$then(function () {
                    if($scope.customer.contacts.length==0){
                        $scope.customer.contacts.$build().$reveal();
                    }
                });
            });

        } else {
            $scope.customer = Customer.$build();
            $scope.customer.contacts.$build().$reveal();
            $scope.customer.ShippingLocation = null;
            $scope.customer.BillingLocation = null;
        }

        $scope.BillShip = function () {
            if (!$scope.customer.ShippingLocation)
                $scope.customer.ShippingLocation = {};
            if (!$scope.customer.BillingLocation)
                $scope.customer.BillingLocation = {};
            if ($scope.customer.BillShip) {
                $scope.customer.ShippingLocation.Address = $scope.customer.BillingLocation.Address;
                $scope.customer.ShippingLocation.Address1 = $scope.customer.BillingLocation.Address1;
                $scope.customer.ShippingLocation.City = $scope.customer.BillingLocation.City;
                $scope.customer.ShippingLocation.State = $scope.customer.BillingLocation.State;
                $scope.customer.ShippingLocation.Zipcode = $scope.customer.BillingLocation.Zipcode;
            }
            else {
                $scope.customer.ShippingLocation.Address = '';
                $scope.customer.ShippingLocation.Address1 = '';
                $scope.customer.ShippingLocation.City = '';
                $scope.customer.ShippingLocation.State = '';
                $scope.customer.ShippingLocation.Zipcode = '';
            }
        };

        $scope.addContact = function(){
            $scope.customer.contacts.$build().$reveal();
        }

        $scope.removeContact = function(contact){
            $scope.customer.contacts.$remove(contact);
        }

        $scope.save = function () {
            //    $validation.validate($scope, 'customer').success(function() {

            if (!_.isUndefined($scope.customer.Id)) {
                var customer = $scope.customer;
                $scope.customer.Contacts = [];
                var count = 0;
                for (var i = 0; i < customer.contacts.length; i++) {
                    if (customer.contacts[i].Name) {
                        $scope.customer.Contacts[count] = customer.contacts[i];
                        count++;
                    }
                }
                $scope.customer.$save().$then(function (response) {
                    $rootScope.$broadcast('customer::updated');
                    toaster.pop('success', 'Customer Updated ', 'You have been successfully updated a customer.')
                    $state.go("app.customer");
                }, function () {
                    toaster.pop('error', 'Error', 'Something went wrong a new Customer could not be created');
                });
            } else {
                var customer = Customer.$build();
                customer.Name = $scope.customer.Name;
                customer.Phone = $scope.customer.Phone;
                customer.Mobile = $scope.customer.Mobile;
                customer.Fax = $scope.customer.Fax;
                customer.CompanyName = $scope.customer.CompanyName;
                customer.WebSite = $scope.customer.WebSite;
                customer.AccountNumber = $scope.customer.AccountNumber;

                customer.BillingLocation = $scope.customer.BillingLocation;
                customer.ShippingLocation = $scope.customer.ShippingLocation;
                customer.BankAccountName = $scope.customer.BankAccountName;
                customer.BankAccount = $scope.customer.BankAccount;
                customer.BatchPaymentsDetails = $scope.customer.BatchPaymentsDetails;

                customer.Contacts = [];
                var count = 0;
                for (var i = 0; i < $scope.customer.contacts.length; i++) {
                    if ($scope.customer.contacts[i].Name) {
                        customer.Contacts[count] = $scope.customer.contacts[i];
                        count++;
                    }

                }

                customer.$save().$then(function (response) {
                    $rootScope.$broadcast('customer::created');
                    toaster.pop('success', 'Customer Created', 'You have successfully created a new customer.');
                    $state.go("app.customer");
                }, function () {
                    toaster.pop('error', 'Error', 'Something went wrong a new Customer could not be created');
                });
            }
            //}).error(function() {
            //    toaster.pop('error', 'Error', 'Complete the required entry fields.');
            //});
        };
    }]);