'use strict';

/**
 * @ngdoc overview
 * @name Dashboard
 * @description
 * The Dashboard module provides users with a dashboard that groups relevant graphs and information for the ship.
 *
 * Dashboard module.
 */
angular.module('dashboard', [
        'ngRoute',
        'ngSanitize',
        'pascalprecht.translate'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.dashboard', {
                url: 'dashboard',
                templateUrl: 'src/modules/dashboard/views/dashboard.html',
                controller: 'DashboardController'
            })
            .state('app.dashboard-onboard', {
                url: 'dashboard/onboard/search/:term',
                templateUrl: 'src/modules/dashboard/views/dashboard.html',
                controller: 'DashboardController'
            })
        ;
    }]);
