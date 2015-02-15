'use strict';

/**
 * @ngdoc overview
 * @name Product
 * @description
 * The product module includes functionality to do CRUD on products
 *
 * Dashboard module.
 */
angular.module('product', [])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('app.product', {
            url: 'products',
            templateUrl: 'src/modules/product/views/list.html',
            controller: 'ProductController'
        })
        .state('app.product-create', {
            url: 'products/create',
            templateUrl: 'src/modules/product/views/form.html',
            controller: 'ProductFormController'
        })
        .state('app.product-update', {
            url: 'products/update/:id',
            templateUrl: 'src/modules/product/views/form.html',
            controller: 'ProductFormController'
        })
        .state('app.product-view', {
            url: 'products/view/:id',
            templateUrl: 'src/modules/product/views/detail.html',
            controller: 'ReviewProductController'
        })
    ;
}]);
