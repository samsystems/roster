'use strict';

/**
 * @ngdoc overview
 * @name Dashboard
 * @description
 * The Dashboard module provides users with a dashboard that groups relevant graphs and information for the ship.
 *
 * Dashboard module.
 */
angular.module('invoice', [
    'ngRoute',
    'ngSanitize',
    'pascalprecht.translate'
])
.config(['$stateProvider', '$validationProvider', '$injector', function ($stateProvider, $validationProvider, $injector) {
    $stateProvider
        .state('app.invoice', {
            url: 'invoice',
            templateUrl: 'src/modules/invoice/views/index.html',
            controller: 'InvoiceController'
        })
        .state('app.invoice/view', {
            url: 'invoice/view/:id',
            templateUrl: 'src/modules/invoice/views/detail.html',
            controller: 'InvoiceViewController'
        })
        .state('app.invoice/print', {
            url: 'invoice/print/:id',
            templateUrl: 'src/modules/invoice/views/print.html',
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
