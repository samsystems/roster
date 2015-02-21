'use strict';

/**
 * @ngdoc overview
 * @name Dashboard
 * @description
 * The Dashboard module provides users with a dashboard that groups relevant graphs and information for the ship.
 *
 * Dashboard module.
 */
angular.module('customer', [
    'ngRoute',
    'ngSanitize',
    'pascalprecht.translate'
])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('app.customer', {
            url: 'customers',
            templateUrl: 'src/modules/customer/views/list.html',
            controller: 'CustomerController'
        })
        .state('app.customer-create', {
            url: 'customers/create',
            templateUrl: 'src/modules/customer/views/form.html',
            controller: 'CustomerFormController'
        })
        .state('app.customer-update', {
            url: 'customers/update/:id',
            templateUrl: 'src/modules/customer/views/form.html',
            controller: 'CustomerFormController'
        })
        .state('app.customer-view', {
            url: 'customers/view/:id',
            templateUrl: 'src/modules/customer/views/detail.html',
            controller: 'CustomerViewController'
        })
    ;
}]);