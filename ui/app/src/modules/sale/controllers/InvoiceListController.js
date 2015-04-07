'use strict';

angular.module('sale').controller('InvoiceListController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Invoice', 'ngTableParams', '$filter', '$q', '$window', '$location', '$timeout', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Invoice, ngTableParams, $filter, $q, $window, $location, $timeout) {

    $scope.page = 1;
    $scope.search = {invoice: ""};

    $scope.limitInPage = config.application.limitInPage;

    $scope.search = function () {
         $scope.invoiceTable.reload()
    };

    $scope.refresh = function () {
        $scope.searchInvoice = '';
    };

    $scope.class = {
        draft: 'primary',
        completed: 'success',
        paid: 'success',
        void: 'danger'
    };


    $scope.invoiceTable = new ngTableParams({
        page: 1,            // show first page
        count: 20           // count per page
    }, {
        total: 0, // length of data
        getData: function ($defer, params) {

            var invoices = Invoice.$search({status: 'all', keyword: $scope.searchInvoice, page: params.page(), sort: params.orderBy()});
            var total = Invoice.count("all", $scope.searchInvoice);

            $q.all([invoices.$asPromise(), total]).then(function (data) {
                $scope.total = data[1].data.total;
                params.total(data[1].data.total);
                $defer.resolve(data[0]);
            })
        }
    });

    $scope.$watch('searchInvoice', function (data) {
        $scope.search();
    });

    /* $rootScope.$on('invoice::created', function (event, invoice) {
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

    $scope.selectInvoice = function (invoice) {
        if(invoice.Status == 'open')
        $location.path("/transaction/update/" + invoice.Id);
    };

    $scope.viewInvoice = function (invoice) {
        $location.path("/transaction/view/" + invoice.Id);
    };

    $scope.print = function (invoice) {
        /* invoices = Object.keys(invoices).map(function (key) {
         if (invoices[key]['checked']) return key
         });
         var count_check = 0;
         var marcado = null;
         angular.forEach(
         invoices,
         function (invoice) {
         if (invoice) {
         marcado = invoice;
         count_check++;
         if (count_check > 1) {
         toaster.pop('error', 'Error', 'Select only one invoice');
         return;
         }
         }
         });
         if (count_check == 1) {
         $location.path("/invoice/print/" + marcado);
         }*/
        $location.path("/transaction/print/" + invoice.Id);
    };

    $scope.pdf = function (invoice) {
        /*  invoices = Object.keys(invoices).map(function (key) {
         if (invoices[key]['checked']) return key
         });
         var count_check = 0;
         var marcado = null;
         angular.forEach(
         invoices,
         function (invoice) {
         if (invoice) {
         marcado = invoice;
         count_check++;
         if (count_check > 1) {
         toaster.pop('error', 'Error', 'Select only one invoice');
         return;
         }
         }
         });
         if (count_check == 1) {

         }*/

        $scope.invoicePdf = invoice.$fetch();

        $scope.invoicePdf.itemProducts.$fetch().$asPromise().then(function (response) {
            $timeout(function () {
                var html = document.getElementById('pdf').innerHTML;
                Invoice.pdf(html, true).success(function (pdf_base64) {
                    $window.open("data:application/pdf;base64, " + pdf_base64.response, false);
                });
            });
        });
    };

    $scope.removeInvoice = function (invoice) {
        dialogs.confirm('Remove a Invoice', 'Are you sure you want to remove a Invoice?').result.then(function (btn) {
            invoice.$destroy().$then(function () {
                $rootScope.$broadcast('invoice::deleted');
                toaster.pop('success', 'Invoice Deleted', 'You have successfully deleted a invoice.')
            });
        });
    };

    $scope.void = function (invoice) {
        invoice.Status = 'void';
        invoice.$save().$then(function (response) {
            $rootScope.$broadcast('invoice::updated');
            toaster.pop('success', 'Invoice Updated ', 'You have been successfully to change de status to Void.')
        });
    };

    $scope.checkboxes = { InvoiceProducts: {} };
}]);