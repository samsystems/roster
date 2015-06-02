'use strict';


angular.module('sale', [
    'ngRoute',
    'ngSanitize',
    'pascalprecht.translate'
])
.config(['$stateProvider', '$validationProvider', '$injector', function ($stateProvider, $validationProvider, $injector) {
    $stateProvider
        .state('app.sale', {
            url: 'sales/:action',
            templateUrl: 'src/modules/sale/views/list.html',
            controller: 'InvoiceListController'
        })
        .state('app.receivePaymet-create', {
            url: 'transaction/create/receivePaymet',
            templateUrl: 'src/modules/sale/views/receivePaymet/form.html',
            controller: 'ReceivePaymentFormController'
        })
        .state('app.invoice-create', {
            url: 'transaction/create/:type',
            templateUrl: 'src/modules/sale/views/form.html',
            controller: 'InvoiceFormController'
        })
        .state('app.invoice/print', {
            url: 'transaction/print/:id',
            templateUrl: 'src/modules/sale/views/print.html',
            controller: 'InvoicePrintController'
        })
        .state('app.invoice/view', {
            url: 'transaction/view/:id',
            templateUrl: 'src/modules/sale/views/detail.html',
            controller: 'InvoiceViewController'
        })
        .state('app.invoice-update', {
            url: 'transaction/:action/:id',
            templateUrl: 'src/modules/sale/views/form.html',
            controller: 'InvoiceFormController'
        });




    $validationProvider.setExpression({
        checkQuantity: function (value, scope, element, attrs) {
            var stock = element.attr('data-stock');
            var quantity = (element.attr('data-quantity'))?element.attr('data-quantity'):0;

            if (value) {
                return !(parseInt(stock) + parseInt(quantity)< parseInt(value));
            }
        }
    }).setDefaultMsg({
        error: {
            // TODO: make into a var
            error: 'The maximum quantity in stock is ' + 0,
            success: 'In Stock!'
        }
    });
}]);
