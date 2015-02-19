'use strict';

/**
 * @ngdoc overview
 * @name Dashboard
 * @description
 * The Dashboard module provides users with a dashboard that groups relevant graphs and information for the ship.
 *
 * Dashboard module.
 */
angular.module('purchase', [
    'ngRoute',
    'ngSanitize',
    'pascalprecht.translate'
])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('app.purchaseOrder', {
            url: 'purchases',
            templateUrl: 'src/modules/purchase/views/index.html',
            controller: 'PurchaseController'
        })
        .state('app.purchaseOrder-view', {
            url: 'purchases/view/:id',
            templateUrl: 'src/modules/purchase/views/detail.html',
            controller: 'ReviewPurchaseController'
        })
        .state('app.purchaseOrder-create', {
            url: 'purchase/create',
            templateUrl: 'src/modules/purchase/views/form.html',
            controller: 'PurchaseFormController'
        })
        .state('app.purchaseOrder-update', {
            url: 'purchase/update/:id',
            templateUrl: 'src/modules/purchase/views/form.html',
            controller: 'PurchaseFormController'
        })
    ;
}]);
