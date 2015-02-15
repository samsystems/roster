'use strict';

/**
 * @ngdoc overview
 * @name Dashboard
 * @description
 * The Dashboard module provides users with a dashboard that groups relevant graphs and information for the ship.
 *
 * Dashboard module.
 */
angular.module('notification', [
    'ngRoute',
    'ngSanitize',
    'pascalprecht.translate'
])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('app.notification', {
            url: 'notifications',
            templateUrl: 'src/modules/notification/views/list.html',
            controller: 'NotificationController'
        })
        .state('app.notification-create', {
            url: 'notifications/create',
            templateUrl: 'src/modules/notification/views/form.html',
            controller: 'NotificationFormController'
        })
        .state('app.notification-view', {
            url: 'notifications/view/:id',
            templateUrl: 'src/modules/notification/views/detail.html',
            controller: 'NotificationViewController'
        })
    ;
}]);
