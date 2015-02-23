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

    $scope.paid = function (invoices) {
        invoices = Object.keys(invoices).map(function (key) {
            if (invoices[key]['checked']) return key
        });
        var count = 0;
        var marcado = [];
        angular.forEach(
            invoices,
            function (invoice) {
                if (invoice) {
                    marcado[count] = invoice;
                    count++;
                }
            });
        if (marcado.length > 0) {
            for (var i = 0; i < marcado.length; i++) {
                $scope.invoice = Invoice.$find(marcado[i]).$then(function (response) {
                    $scope.invoice.Status = 'paid';
                    $scope.invoice.$update({id: $scope.invoice.Id}, function (response) {
                        $rootScope.$broadcast('invoice::updated');
                        $rootScope.$broadcast('invoice::totalTab');
                    });
                });
            }
            toaster.pop('success', 'Invoice Update');
        }
    };
    $scope.checkboxes = { InvoiceProducts: {} };
}]);