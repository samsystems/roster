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
            var invoices = Invoice.$search({status:'completed',keyword: $scope.search.invoice, page: params.page(), sort: params.orderBy()});
            $scope.total = Invoice.count("completed",$scope.search.invoice);

            $q.all([invoices.$asPromise(), $scope.total]).then(function (data) {
                params.total(data[1].data.total);
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


    $scope.checkboxes = { InvoiceProducts: {} };
}]);