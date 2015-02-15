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
        .state('app.purchase', {
            url: 'purchases',
            templateUrl: 'src/modules/purchase/views/index.html',
            controller: 'PurchaseController'
        })
        .state('app.purchase/view', {
            url: 'purchases/view/:id',
            templateUrl: 'src/modules/purchase/views/detail.html',
            controller: 'ReviewPurchaseController'
        })
        .state('app.purchase/new', {
            url: 'purchases/new',
            templateUrl: 'src/modules/purchase/views/new.html',
            controller: 'PurchaseFormController'
        })
    ;
}]);
