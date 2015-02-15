'use strict';

/**
 * @ngdoc overview
 * @name Dashboard
 * @description
 * The Dashboard module provides users with a dashboard that groups relevant graphs and information for the ship.
 *
 * Dashboard module.
 */
angular.module('company', [
    'ngRoute',
    'ngSanitize',
    'pascalprecht.translate'
])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('app.company', {
            url: 'companies',
            templateUrl: 'src/modules/company/views/list.html',
            controller: 'CompanyController'
        })
        .state('app.company-create', {
            url: 'companies/create',
            templateUrl: 'src/modules/company/views/form.html',
            controller: 'CompanyFormController'
        })
        .state('app.company-update', {
            url: 'companies/update/:id',
            templateUrl: 'src/modules/company/views/form.html',
            controller: 'CompanyFormController'
        })
        .state('app.company-view', {
            url: 'companies/view/:id',
            templateUrl: 'src/modules/company/views/detail.html',
            controller: 'CompanyViewController'
        })
    ;
}]);
