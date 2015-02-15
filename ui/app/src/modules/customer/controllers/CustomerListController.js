'use strict';

angular.module('customer').controller('CustomerListController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Customer', 'ngTableParams', '$filter', '$q', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Customer, ngTableParams, $filter, $q) {

    $scope.page = 1;
    $scope.searchCustomer = '';

    $scope.limitInPage = config.application.limitInPage;


    $scope.search = function (term) {
        $scope.customerTable.reload()
    };

    $scope.refresh = function () {
        $scope.searchCustomer = '';
    };

    $scope.customerTable = new ngTableParams({
        page: 1,            // show first page
        count: 5           // count per page
    }, {
        total: 0, // length of data
        getData: function ($defer, params) {
            var sort = params.orderBy() != false ? params.orderBy() : 'notSorting';
            var customers = null;
            if (!_.isUndefined($scope.searchCustomer) && $scope.searchCustomer != '') {
                customers = Customer.$search({keyword: $scope.searchCustomer, page: params.page(), order: sort});
                $scope.total = Customer.$search({keyword: $scope.searchCustomer}).count();
            }
            else {
                customers = Customer.$search({page: params.page(), order: sort});
                $scope.total = Customer.$search().count();
            }
            $q.all([customers.$promise, $scope.total.$promise]).then(function (data) {
                params.total($scope.total.count);
                $defer.resolve(data[0]);
            })
        }
    });

    $scope.$watch('searchCustomer', function (data) {
        $scope.search();
    });

    $rootScope.$on('customer::created', function (event) {
        $scope.customerTable.reload();
    });

    $rootScope.$on('customer::updated', function (event) {
        $scope.customerTable.reload();
    });

    $rootScope.$on('customer::deleted', function ($event) {
        $scope.customerTable.reload();
    });

    $scope.removeCustomer = function (customer) {
        dialogs.confirm('Remove a Customer', 'Are you sure you want to remove a Customer?').result.then(function (btn) {
            customer.$delete({id: customer.id}, function (response) {
                $rootScope.$broadcast('customer::deleted');
                toaster.pop('success', 'Customer Deleted', 'You have successfully deleted a customer.')
            });
        });
    };
}]);