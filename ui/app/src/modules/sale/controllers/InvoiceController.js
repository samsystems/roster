'use strict';

angular.module('invoice').controller('InvoiceController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'WizardHandler', 'Invoice', '$location', 'Country', 'State', '$print', '$http', '$timeout', '$window', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, WizardHandler, Invoice, $location, Country, State, $print, $http, $timeout, $window) {

//    updateTotalTabs();

    $scope.countries = Country.$search();
    $scope.states = State.$search();

    $scope.step = {
        list: 'list',
        form: 'form'
    };


    $scope.flag_status = {
        open: 'OPEN',
        openSent: 'OPENSENT',
        partial: 'PARTIAL',
        overdue: 'OVERDUE',
        billed: 'BILLED',
        draft: 'DRAFT',
        completed: 'COMPLETED',
        paid: 'PAID',
        void: 'VOID'
    };

    /*  function updateTotalTabs() {
     $scope.total_draft      = Invoice.$search({status: 'draft'}).count();
     $scope.total_completed  = Invoice.$search({status: 'completed'}).count();
     $scope.total_paid       = Invoice.$search({status: 'paid'}).count();
     $scope.total_invoices   = Invoice.$search({status: 'all'}).count();
     }
     */
    $scope.$goTo = function (step) {
        WizardHandler.wizard().goTo(step);
    };

    /*$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name == 'app.sale' && fromState.name == 'app.dashboard' && toParams.action == 'newInvoice') {
            $timeout(function () {
                $scope.createInvoice();
            });
        }
    });*/

    /*$scope.createInvoice = function () {

        $scope.visible = true;
        $scope.item_input = "";
        $scope.invoice = {
            OrderNumber: '',
            Status: 'draft',
            ReferenceNumber: '',
            Date: DateTimeService.nowIsoFormat(),
            DeliveryDate: DateTimeService.nowIsoFormat(),
            Currency: "USD",
            DeliveryInstruction: '',
            Vendor: '',
            Customer: null,
            CustomerShipping: null,
            InvoiceProducts: []
        };

        disable(false, $scope.invoice);
        var invoiceNumber = Invoice.maxOrderNumber().success(function (response) {
            $scope.invoice.OrderNumber = response.max;
            console.log(response.max);
        });

        $scope.$goTo($scope.step.form);
    };
*/
    $scope.getList = function () {
        $scope.$goTo($scope.step.list);
    };

    // TODO: no spanish!
    $scope.required = function () {
        $scope.required = "required";
    };

    // TODO: no spanish!
    $scope.selectInvoice = function (invoice) {
        $scope.invoice = Invoice.$find(invoice.Id).$then(function () {
            if ($scope.invoice.Status != 'draft') {
                disable(true, invoice);
            } else
                disable(false, invoice);

            $scope.invoice.products.$fetch().$asPromise().then(function (response) {
                for (var i = 0; i < response.length; i++) {
                    response[i] = {
                        Id:response[i].Id,
                        Product:  response[i].Product,
                        Price:  response[i].Product.Price,
                        Quantity: response[i].Quantity,
                        QuantitySave: parseInt(response[i].Quantity)
                    };

                }
                $scope.invoice.InvoiceProducts = response;

                delete $scope.invoice.Updater;
                delete $scope.invoice.SubTotal;
                delete $scope.invoice.TotalTax;
                delete $scope.invoice.Amount;
            })
        });
        $scope.$goTo($scope.step.form);
    };

    $scope.copyto = function (invoices) {
        invoices = Object.keys(invoices).map(function (key) {
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
            $scope.invoice = Invoice.$find(marcado).$then(function () {
                Invoice.maxOrderNumber().success(function (response) {
                    $scope.invoice.OrderNumber = response.max;
                });
                $scope.invoice.Status = 'draft';
                $scope.invoice.Id = null;
                $scope.invoice.products.$fetch().$asPromise().then(function (response) {
                    for (var i = 0; i < response.length; i++) {
                        response[i] = {Product:  response[i].Product, Price:  response[i].Product.Price, Quantity: response[i].Quantity};
                    }
                    disable(false, $scope.invoice);
                    $scope.invoice.InvoiceProducts = response;
                })

            });

            $scope.$goTo($scope.step.form);
        }
    };


    $scope.sendMailPdf = function (invoices) {
        invoices = Object.keys(invoices).map(function (key) {
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
                        console.log(count_check);
                        toaster.pop('error', 'Error', 'Select only one invoice');
                        return;
                    }
                }
            });
        if (count_check == 1) {
            $scope.invoicePdf = Invoice.$find(marcado).$then(function () {
                $timeout(function () {
                    var html = document.getElementById('pdf').innerHTML;
                    Invoice.sendMailPdf({html: html, id: marcado}, function () {
                        toaster.pop('success', 'Invoice Mail', 'You have successfully send mail the invoices.');
                    });
                });

            });
        }

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
         console.log(count_check);
         if (count_check > 1) {
         toaster.pop('error', 'Error', 'Select only one invoice');
         return;
         }
         }
         });
         if (count_check == 1) {
         $location.path("/invoice/print/" + marcado);
         }*/
        console.log('dfdf');
        $location.path("/invoice/print/" + invoice);
    };

    $scope.pdf = function (invoices) {
        invoices = Object.keys(invoices).map(function (key) {
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
            $scope.invoicePdf = Invoice.$find(marcado).$then(function () {
                $timeout(function () {
                    var html = document.getElementById('pdf').innerHTML;
                    Invoice.pdf(html).success(function (pdf_base64) {
                        $window.open("data:pdf;base64, " + pdf_base64.response, true);
                    });
                });
            });
        }
    };

    $scope.removeGeneral = function (invoices) {

        invoices = Object.keys(invoices).map(function (key) {
            if (invoices[key]['checked']) return {Id: key, 'Status': invoices[key]['Status']}
        });
        var count = 0;
        var marcado = [];
        var status = [];
        angular.forEach(
            invoices,
            function (invoice) {
                if (invoice) {
                    marcado[count] = invoice.Id;
                    status[count] = invoice.Status;
                    count++;
                }
            });
        if (marcado.length > 0) {
            dialogs.confirm('Remove a Invoice', 'Are you sure you want to remove the Invoices?').result.then(function (btn) {
                for (var i = 0; i < status.length; i++) {
                    if (status[i] != 'draft') {
                        toaster.pop('error', 'Error', 'can only be removed draft invoices');
                        return;
                    }
                }
                for (var i = 0; i < marcado.length; i++) {
                    if (status[i] == 'draft') {
                        Invoice.$find(marcado[i]).$asPromise().then(function (responseDelete) {
                            responseDelete.$destroy().$then(function () {
                                $rootScope.$broadcast('invoice::deleted');
                                $rootScope.$broadcast('invoice::totalTab');
                            });
                        });
                    } else {
                        toaster.pop('error', 'Error', 'can only be removed draft invoices');
                        return;
                    }
                }
                $timeout(function () {
                    toaster.pop('success', 'Invoice Deleted', 'You have successfully deleted the invoices.');
                });
            });
        }
    };


    function disable(valor, invoice) {
        angular.forEach(
            angular.element('#form_invoice .form-control'),
            function (inputElem) {
                angular.element(inputElem).attr('readonly', valor);
            });
        angular.forEach(
            angular.element('date-time-picker'),
            function (inputElem) {
                angular.element(inputElem).attr('readonly', valor);
            });
        $scope.visible = !valor;
        if (invoice.CustomerShipping) {
            angular.element('#CustomerShipping').attr('readonly', true);
            $scope.invoice.BillShip = true;
        }
    }

    $scope.viewInvoice = function (invoice) {
        $location.path("/invoice/view/" + invoice.Id);
    };

    $scope.$close = function () {
        $scope.$goTo($scope.step.list);
    };

    /*  $rootScope.$on('invoice::updated', function (event, invoice) {
     if (!_.isEmpty(invoice) && invoice.status == 'draft') {
     var exist = false;
     for (var i = 0; i < $scope.invoices.length; i++) {
     if ($scope.invoices[i].id == invoice.id) {
     $scope.invoices[i] = invoice;
     exist = true;
     break;
     }
     }
     if (!exist) {
     $scope.total = invoiceResource.findCount({status: invoice.status});
     $scope.invoices.push(invoice);
     }
     }
     else
     deleteInvoiceDraft(invoice);
     });
     */

    /*  $rootScope.$on('invoice::totalTab', function (event, invoice) {
     updateTotalTabs();
     });
     */
  /*  if (!_.isUndefined($stateParams.action) && $stateParams.action == 'newInvoice') {
        $timeout(function () {
            $scope.createInvoice();
        });
    }*/

    /*  angular.element(document).ready(function () {
     if($stateParams.action=='newInvoice'){
     $scope.createInvoice();
     }
     });
     $scope.$on('$viewContentLoaded', function() {
     console.log('ok');
     if($stateParams.action=='newInvoice'){
     $scope.createInvoice();
     }
     });*/
}]);