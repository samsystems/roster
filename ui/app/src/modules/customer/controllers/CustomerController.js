'use strict';

angular.module('customer').controller('CustomerController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'WizardHandler', 'Customer', '$location', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, WizardHandler, Customer, $location, Contact) {

    var customerResource         = Customer.resource;

    $scope.step = {
        list:          'list',
        form:          'form'
    };


    $scope.$goTo = function(step) {
        WizardHandler.wizard().goTo(step);
    };

    $scope.createCustomer = function() {
        $scope.customer = {
            name: null,
            phone: null,
            mobile: null,
            fax: '',
            email: '',
            address: '',
            city: '',
            zipcode: '',
            state: '',
            country: {"id":"US","name":"United States"}
        };
        $scope.$goTo($scope.step.form);
    };

    $scope.getList = function() {
        $scope.$goTo($scope.step.list);
    };

    $scope.selectCustomer = function(customer) {
        $scope.customer = customerResource.get({id: customer.id});

        $rootScope.contactOwner = 'customer';
        $rootScope.contactIdOwner = customer.id;
        $scope.$goTo($scope.step.form);
    };

    $scope.viewCustomer = function(customer) {
        $location.path( "/customer/view/"+customer.id);
    };

    $scope.$close = function() {
        $scope.$goTo($scope.step.list);
    };
}]);