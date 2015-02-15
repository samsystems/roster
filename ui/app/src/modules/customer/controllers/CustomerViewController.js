'use strict';

angular.module('customer').controller('CustomerViewController', ['$scope', '$rootScope', 'dialogs', '$state', 'toaster', '$stateParams', 'config', 'DateTimeService', 'Customer', 'Contact', function ($scope, $rootScope, dialogs, $state, toaster, $stateParams, config, DateTimeService, Customer, Contact) {

    var CustomerResource         = Customer.resource;
    var contactResource         = Contact.resource;

    $scope.page = 1;
    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
    $scope.customer = {};

    if(id != null){
        $scope.contacts = contactResource.findAll({owner : 'customer',idowner : id,page : $scope.page, order: 'notSorting'});
        $scope.customer = CustomerResource.get({id: id});
    }


    $scope.removeCustomer = function(customer) {
        dialogs.confirm('Remove a Customer', 'Are you sure you want to remove a Customer?').result.then(function(btn){
            customer.$delete({id: customer.id}, function (response) {
                $rootScope.$broadcast('customer::deleted', response);
                toaster.pop('success', 'Customer Deleted', 'You have successfully deleted a customer.')
            });
            $state.go("app.customer");
        });
    };

}]);