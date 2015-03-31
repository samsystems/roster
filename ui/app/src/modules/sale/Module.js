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
            controller: 'SaleController'
        })
        .state('app.invoice', {
            url: 'invoice',
            templateUrl: 'src/modules/sale/views/index.html',
            controller: 'InvoiceController'
        })
        .state('app.invoice-create', {
            url: 'invoice/create/:type',
            templateUrl: 'src/modules/sale/views/form.html',
            controller: 'InvoiceFormController'
        })
        .state('app.invoice-update', {
            url: 'invoice/update/:id',
            templateUrl: 'src/modules/sale/views/form.html',
            controller: 'InvoiceFormController'
        })
        .state('app.invoice/view', {
            url: 'invoice/view/:id',
            templateUrl: 'src/modules/sale/views/detail.html',
            controller: 'InvoiceViewController'
        })
        .state('app.invoice/print', {
            url: 'invoice/print/:id',
            templateUrl: 'src/modules/sale/views/print.html',
            controller: 'InvoicePrintController'
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
