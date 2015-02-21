'use strict';

/**
 * @ngdoc overview
 * @name Dashboard
 * @description
 * The Dashboard module provides users with a dashboard that groups relevant graphs and information for the ship.
 *
 * Dashboard module.
 */
angular.module('vendor', [
    'ngRoute',
    'ngSanitize',
    'pascalprecht.translate'
])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('app.vendor', {
            url: 'vendors',
            templateUrl: 'src/modules/vendor/views/list.html',
            controller: 'VendorController'
        })
        .state('app.vendor-create', {
          url: 'vendors/create',
          templateUrl: 'src/modules/vendor/views/form.html',
          controller: 'VendorFormController'
        })
        .state('app.vendor-update', {
          url: 'vendors/update/:id',
          templateUrl: 'src/modules/vendor/views/form.html',
          controller: 'VendorFormController'
        })
        .state('app.vendor-view', {
            url: 'vendors/view/:id',
            templateUrl: 'src/modules/vendor/views/detail.html',
            controller: 'VendorViewController'
        })
    ;
}]);
