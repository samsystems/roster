'use strict';

angular.module('customer').controller('CustomerFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Customer', 'Country', 'State', '$state',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, Customer, Country, State, $state) {

        $scope.countries = Country.$search();
        $scope.states = State.$search();
        $scope.customer = {};

        if (!_.isUndefined($stateParams.id)) {
            $scope.customer = Customer.$find($stateParams.id);
            $scope.customer.contacts.$fetch();
        } else {
            $scope.customer = Customer.$build();
            $scope.customer.contacts.$build().$reveal();
        }

        $scope.BillShip = function () {
            if ($scope.customer.BillShip) {
                $scope.customer.ShippingAddress = $scope.customer.BillingAddress;
                $scope.customer.ShippingAddress1 = $scope.customer.BillingAddress1;
                $scope.customer.ShippingCity = $scope.customer.BillingCity;
                $scope.customer.ShippingState = $scope.customer.BillingState;
                $scope.customer.ShippingZipcode = $scope.customer.BillingZipcode;
                angular.element('#CustomerShipping').attr('readonly', true);
            }
            else {
                $scope.customer.ShippingAddress = '';
                $scope.customer.ShippingAddress1 = '';
                $scope.customer.ShippingCity = '';
                $scope.customer.ShippingState = '';
                $scope.customer.ShippingZipcode = '';
                angular.element('#CustomerShipping').attr('readonly', false);
            }
        };


        $scope.addContact = function (index) {
            if (index == $scope.customer.contacts.length - 1)
                $scope.customer.contacts.$build().$reveal();
        }

        $scope.save = function () {
            //    $validation.validate($scope, 'customer').success(function() {

            if (!_.isUndefined($scope.customer.Id)) {
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
                customer.BillingAddress = $scope.customer.BillingAddress;
                customer.BillingAddress1 = $scope.customer.ShippingAddress1;
                customer.BillingCity = $scope.customer.BillingCity;
                customer.BillingState = $scope.customer.BillingState;
                customer.BillingZipcode = $scope.customer.BillingZipcode;
                customer.ShippingAddress = $scope.customer.ShippingAddress;
                customer.ShippingAddress1 = $scope.customer.ShippingAddress1;
                customer.ShippingCity = $scope.customer.ShippingCity;
                customer.ShippingState = $scope.customer.ShippingState;
                customer.ShippingZipcode = $scope.customer.ShippingZipcode;
                // customer.Tax = $scope.customer.Name;
                // customer.Discount = $scope.customer.Name;
                customer.BankAccountName = $scope.customer.BankAccountName;
                customer.BankAccount = $scope.customer.BankAccount;
                customer.BatchPaymentsDetailt = $scope.customer.BatchPaymentsDetailt;
                customer.Contacts = $scope.customer.contacts;


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