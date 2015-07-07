'use strict';

angular.module('sale').controller('BillController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'WizardHandler', '$location', 'User', 'Invoice', 'CurrencyService',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, WizardHandler, $location, User, Invoice, CurrencyService) {

        $scope.step = {
            list: 'list',
            form: 'form'
        };

        $scope.page = 1;

        $scope.class = {
            draft: 'primary',
            completed: 'warning',
            paid: 'success',
            void: 'danger'
        };

        $scope.currency = CurrencyService.current();


       /* updateSummaryData();

        function updateSummaryData() {
           // $scope.invoices = Invoice.$search({status: 'lastWeek'});

            Invoice.getResume('draft').success(function (response) {
                $rootScope.qty_draft = response.cant;
                $scope.amountInvoicesDraft = response.amount;
            });
            Invoice.getResume('completed').success(function (response) {
                $rootScope.qty_completed = response.cant;
                $scope.amountInvoicesCompleted = response.amount;
            });
            Invoice.getResume('paid').success(function (response) {
                $rootScope.qty_paid = response.cant;
                $scope.amountInvoicesPaid = response.amount;
            });
            // TODO: Find all overdue (filte por fecha de pago vencida)
            Invoice.getResume('all').success(function (response) {
                $rootScope.qty_all = response.cant;
                $scope.amountInvoicesAll = response.amount;
            });
            // TODO: Find all overdue (filte por fecha de pago vencida)
            Invoice.getResume('all').success(function (response) {
                $scope.qty_overdues = response.cant;
                $scope.amountInvoicesOverdue = response.amount;
            });
            //  $scope.qty_invoices = Invoice.$search({status: 'all'}).count();

            /* var invoices_draft = Invoice.$search({status: 'draft', order:'notSorting'}, {page: $scope.page}).$then(function() {
             $scope.amountInvoicesDraft = 0;
             for (var i = 0; i < invoices_draft.length; i++) {
             $scope.amountInvoicesDraft += parseFloat(invoices_draft[i].amount);
             }
             });

             // TODO: Find all overdue
             var invoicesOverdue = Invoice.$search().$then(function () {
             $scope.qty_overdues = 0;
             $scope.amountInvoicesOverdue = 0;
             for (var i = 0; i < invoicesOverdue.length; i++) {
             $scope.amountInvoicesOverdue += parseFloat(invoicesOverdue[i].amount);
             $scope.qty_overdues++;
             }
             });
        }
        */

     /*   $scope.$goTo = function (step) {
            WizardHandler.wizard().goTo(step);
        };

        $rootScope.$on('invoice::updated', function (event, invoice) {
            updateSummaryData();
        });

        $rootScope.$on('invoice::deleted', function ($event, invoice) {
            updateSummaryData();
        });*/


        $scope.createBill = function () {
            $scope.bill = {
                number: '',
                description: '',
                currency: {"value": "USD", "description": "USD United State"}
            };
            $scope.$goTo($scope.step.form);
        };

        $scope.getList = function () {
            $scope.$goTo($scope.step.list);
        };

        $scope.selectBill = function (bill) {
            $scope.bill = billResource.get({id: bill.id});
            $scope.$goTo($scope.step.form);
        };

        $scope.viewBill = function (bill) {
            $location.path("/bill/view/" + bill.id);
        };

        $scope.$close = function () {
            $scope.$goTo($scope.step.list);
        };
    }]);