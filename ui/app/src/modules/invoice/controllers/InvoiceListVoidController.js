'use strict';

angular.module('invoice').controller('InvoiceListVoidController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Invoice','ngTableParams','$filter','$q', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Invoice, ngTableParams,$filter, $q) {

    var invoiceResource = Invoice.resource;

    $scope.page = 1;
    $scope.searchInvoice = '';

    $scope.limitInPage = config.application.limitInPage;

    $scope.search = function (term) {
        $scope.invoiceTable.reload()
    };

    $scope.refresh = function () {
        $scope.searchInvoice = '';
    };

    $scope.invoiceTable = new ngTableParams({
        page: 1,            // show first page
        count: 5           // count per page
    }, {
        total: 0, // length of data
        getData: function($defer, params) {
            var sort = params.orderBy() != false ? params.orderBy() : 'notSorting';
            var invoices = null;
            if( !_.isUndefined($scope.searchInvoice) && $scope.searchInvoice != '') {
                invoices = invoiceResource.findByKeyword({status: 'void',keyword: $scope.searchInvoice, page: params.page(), order: sort});
                $scope.total = invoiceResource.findCountByKeyword({status: 'void',keyword: $scope.searchInvoice});
            }
            else {
                invoices = invoiceResource.findAll({status: 'void',page: params.page(), order: sort});
                $scope.total = invoiceResource.findCount({status: 'void'});
            }
            $q.all([invoices.$promise,$scope.total.$promise]).then(function(data){
                params.total($scope.total.count);
                $defer.resolve(data[0]);
            })
        }
    });

    $scope.$watch('searchInvoice', function(data) {
        $scope.search();
    });

    $rootScope.$on('invoice::created', function (event) {
        $scope.invoiceTable.reload();
    });

    $rootScope.$on('invoice::updated', function (event) {
        $scope.invoiceTable.reload();
    });

    $rootScope.$on('invoice::deleted', function ($event) {
        $scope.invoiceTable.reload();
    });

    $scope.removeInvoice = function (invoice) {
        dialogs.confirm('Remove a Invoice', 'Are you sure you want to remove a Invoice?').result.then(function (btn) {
            invoice.$delete({id: invoice.id}, function (response) {
                $rootScope.$broadcast('invoice::deleted');
                toaster.pop('success', 'Invoice Deleted', 'You have successfully deleted a invoice.')
            });
        });
    };

    $scope.checkboxes = { items: {} };
}]);