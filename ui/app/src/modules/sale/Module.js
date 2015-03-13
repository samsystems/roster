'use strict';

/**
 * @ngdoc overview
 * @name Dashboard
 * @description
 * The Dashboard module provides users with a dashboard that groups relevant graphs and information for the ship.
 *
 * Dashboard module.
 */
angular.module('sale', [])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('app.sale', {
            url: 'sales/:action',
            templateUrl: 'src/modules/sale/views/list.html',
            controller: 'SaleController'
        })
    ;
}]);
