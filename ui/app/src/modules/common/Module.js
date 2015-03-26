'use strict';

/**
 * @ngdoc overview
 * @name Common
 * @description
 * Includes common actions like login, logout, etc.
 *
 * Common module of the application.
 */

angular.module('common', [
    'ngRoute',
    'ngSanitize',
    'config',
])
.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$validationProvider', '$injector', function ($stateProvider, $urlRouterProvider, $translateProvider, $validationProvider, $injector) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'src/modules/common/views/login.html',
            controller: 'LoginController'
        })
        .state('forgot', {
            url: '/forgot',
            templateUrl: 'src/modules/common/views/forgot.html',
            controller: 'ForgotController'
        })
        .state('app', {
            url: '/',
            templateUrl: 'src/modules/common/views/app.html'
        })
        .state('404', {
            url: '/404',
            templateUrl: "src/modules/common/views/404.html"
        });

        $urlRouterProvider.when('', '/login');
        $urlRouterProvider.when('/', '/dashboard');
        $urlRouterProvider.when('/admin', '/admin/users');
        $urlRouterProvider.otherwise('/404');

}]);
