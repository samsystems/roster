'use strict';

angular.module('invoice').controller('InvoiceListCompletedController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Invoice','ngTableParams','$filter','$q', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Invoice, ngTableParams,$filter, $q) {

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
                invoices     = Invoice.$search({status: 'completed',keyword: $scope.searchInvoice, page: params.page(), order: sort});
                $scope.total = Invoice.$search({status: 'completed',keyword: $scope.searchInvoice}).count();
            }
            else {
                invoices     = Invoice.$search({status: 'completed',page: params.page(), order: sort});
                $scope.total = Invoice.$search({status: 'completed'}).count();
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

 /*   $rootScope.$on('invoice::created', function (event, invoice) {

        if (!_.isEmpty(invoice) && $scope.status == 'completed') {
            $scope.total = invoiceResource.findCount(invoice.status);
            $scope.invoices.push(invoice);
        }
        else
            deleteInvoiceComplete(invoice);
    });*/

    $rootScope.$on('invoice::updated', function (event) {
        $scope.invoiceTable.reload();
    });

    $rootScope.$on('invoice::deleted', function ($event) {
        $scope.invoiceTable.reload();
    });


    $scope.checkboxes = { items: {} };
}]);