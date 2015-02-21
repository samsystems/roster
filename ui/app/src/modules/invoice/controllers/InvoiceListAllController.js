'use strict';

angular.module('invoice').controller('InvoiceListAllController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Invoice','ngTableParams','$filter','$q', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Invoice, ngTableParams,$filter, $q) {

    $scope.page = 1;
    $scope.search = {invoice: ""};

    $scope.limitInPage = config.application.limitInPage;

    $scope.search = function (term) {
        $scope.invoiceTable.reload()
    };

    $scope.refresh = function () {
        $scope.search.invoice = '';
    };

    $scope.class = {
        draft:          'primary',
        completed:      'success',
        paid:           'success',
        void:           'danger'
    };


    $scope.invoiceTable = new ngTableParams({
        page: 1,            // show first page
        count: 5           // count per page
    }, {
        total: 0, // length of data
        getData: function($defer, params) {
            var invoices = Invoice.$search({status:'all',keyword: $scope.search.invoice, page: params.page(), sort: params.orderBy()});
            $scope.total = Invoice.count("all",$scope.search.invoice);

            $q.all([invoices.$asPromise(), $scope.total]).then(function (data) {
                params.total(data[1].data.total);
                $defer.resolve(data[0]);
            })


          /*  var sort = params.orderBy() != false ? params.orderBy() : 'notSorting';
            var invoices = null;
            if( !_.isUndefined($scope.searchInvoice) && $scope.searchInvoice != '') {
                invoices = Invoice.$search({status: 'all', keyword: $scope.searchInvoice, page: params.page(), order: sort});
                $scope.total = Invoice.$search({status: 'all', keyword: $scope.searchInvoice}).count();
            }
            else {
                invoices = Invoice.$search({status: 'all', page: params.page(), order: sort});
                $scope.total = Invoice.$search({status: 'all'}).count();
            }
            $q.all([invoices.$promise,$scope.total.$promise]).then(function(data){
                params.total($scope.total.count);
                $defer.resolve(data[0]);
            })*/
        }
    });

    $scope.$watch('searchInvoice', function(data) {
        $scope.search();
    });

    /* $rootScope.$on('invoice::created', function (event, invoice) {
     console.log('on draft');
     if (!_.isEmpty(invoice) && invoice.status=='draft') {
     $scope.total = invoiceResource.findCount(invoice.status);
     $scope.invoices.push(invoice);
     }
     else
     deleteInvoiceDraft(invoice);
     });*/

    $rootScope.$on('invoice::updated', function (event) {
        $scope.invoiceTable.reload();
    });

    $rootScope.$on('invoice::deleted', function ($event) {
        $scope.invoiceTable.reload();
    });


    $scope.removeInvoice = function (invoice) {
        dialogs.confirm('Remove a Invoice', 'Are you sure you want to remove a Invoice?111').result.then(function (btn) {
            invoice.$destroy().$asPromise().then(function (response) {
                $rootScope.$broadcast('invoice::deleted');
                $rootScope.$broadcast('invoice::totalTab');
                toaster.pop('success', 'Invoice Deleted', 'You have successfully deleted a invoice.')
            });
        });
    };
    $scope.checkboxes = { InvoiceProducts: {} };
}]);