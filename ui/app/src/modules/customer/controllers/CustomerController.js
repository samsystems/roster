'use strict';

angular.module('customer').controller('CustomerController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Customer', 'State', 'ngTableParams', '$filter', '$q','$state',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Customer, State, ngTableParams, $filter, $q, $state) {

    $scope.page = 1;
    $scope.total =0;
    $scope.search = {customer : ""};

        $scope.states    = State.$search();

    $scope.limitInPage = config.application.limitInPage;

    $scope.search = function(term) {
        $scope.customerTable.reload();
    };

    $scope.refresh = function() {
        $scope.searchCustomer = '';
    };

    $scope.customerTable = new ngTableParams({
        page: 1,            // show first page
        count: 5           // count per page
    }, {
        total: 0, // length of data
        getData: function ($defer, params) {
            var customers = Customer.$search({page: params.page(), sort: params.orderBy(), keyword: $scope.search.customer});
            var total = Customer.count($scope.search.customer);
            $q.all([customers.$asPromise(), total]).then(function (data) {
                $scope.total = data[1].data.total;
                params.total(data[1].data.total);
                $defer.resolve(data[0]);
            })
        }
    });
    $scope.viewCustomer = function(customer){
        $state.go('app.customer-view',{id : customer.Id});
    }
    $scope.editCustomer = function(customer){
        $state.go('app.customer-update',{id : customer.Id});
    }
    $rootScope.$on('customer::deleted', function ($event) {
        $scope.customerTable.reload();
    });

    $scope.removeCustomer = function (customer) {
        dialogs.confirm('Remove a Customer', 'Are you sure you want to remove a Customer?').result.then(function(btn){
            customer.$destroy().$asPromise().then(function (response) {
                $rootScope.$broadcast('customer::deleted');
                toaster.pop('success', 'Customer Deleted', 'You have successfully deleted a customer.')
            });
        });
    };

}]);