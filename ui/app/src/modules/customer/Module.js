'use strict';

/**
 * @ngdoc overview
 * @name Customer
 * @description
 * The Customer module aims to provide a CRUD for customers.
 *
 * Customer module.
 */
angular.module('customer', [])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('app.customer', {
            url: 'customers',
            templateUrl: 'src/modules/customer/views/index.html',
            controller: 'CustomerController'
        })
        .state('app.customer/view', {
            url: 'customers/view/:id',
            templateUrl: 'src/modules/customer/views/detail.html',
            controller: 'CustomerViewController'
        })
    ;
}]);
