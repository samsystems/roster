'use strict';

/**
 * @ngdoc overview
 * @name Dashboard
 * @description
 * The Dashboard module provides users with a dashboard that groups relevant graphs and information for the ship.
 *
 * Dashboard module.
 */
angular.module('sale', [
    'ngRoute',
    'ngSanitize',
    'pascalprecht.translate'
])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('app.sale', {
            url: 'sales/:action',
            templateUrl: 'src/modules/sale/views/index.html',
            controller: 'SaleController'
        })
        .state('app.sale/view', {
            url: 'sales/view/:id',
            templateUrl: 'src/modules/sale/views/detail.html',
            controller: 'ReviewSaleController'
        })
    ;
}]);
