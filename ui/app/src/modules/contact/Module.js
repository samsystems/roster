'use strict';

/**
 * @ngdoc overview
 * @name Dashboard
 * @description
 * The Dashboard module provides users with a dashboard that groups relevant graphs and information for the ship.
 *
 * Dashboard module.
 */
angular.module('contact', [
    'ngRoute',
    'ngSanitize',
    'pascalprecht.translate'
])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('contact', {
            url: 'app.contact',
            templateUrl: 'src/modules/contact/views/index.html',
            controller: 'ContactController'
        })
    ;
}]);
