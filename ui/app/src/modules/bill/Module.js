'use strict';


angular.module('bill', [
    'ngRoute',
    'ngSanitize',
    'pascalprecht.translate'
])
.config(['$stateProvider', '$validationProvider', '$injector', function ($stateProvider, $validationProvider, $injector) {
    $stateProvider
        .state('app.bill', {
            url: 'bill',
            templateUrl: 'src/modules/bill/views/list.html',
            controller: 'BillListController'
        })
        .state('app.bill-create', {
            url: 'bill/create',
            templateUrl: 'src/modules/bill/views/form.html',
            controller: 'BillFormController'
        })
        .state('app.bill/print', {
            url: 'bill/print/:id',
            templateUrl: 'src/modules/bill/views/print.html',
            controller: 'BillPrintController'
        })
        .state('app.bill/view', {
            url: 'bill/view/:id',
            templateUrl: 'src/modules/bill/views/detail.html',
            controller: 'BillViewController'
        })
        .state('app.bill-update', {
            url: 'vendors/update/:id',
            templateUrl: 'src/modules/bill/views/form.html',
            controller: 'BillFormController'
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
