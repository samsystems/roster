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
    'config'
])
    .config(['$stateProvider', '$urlRouterProvider', '$injector', '$validationProvider', function ($stateProvider, $urlRouterProvider, $injector, $validationProvider) {

        $urlRouterProvider.when('', '/login');
        $urlRouterProvider.when('/', '/dashboard');
        $urlRouterProvider.when('/admin', '/admin/users');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'src/modules/common/views/login.html',
                controller: 'LoginController'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'src/modules/common/views/register.html',
                controller: 'RegisterController'
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

        $urlRouterProvider.otherwise('/404');

        $validationProvider.setExpression({
            uniqueRegisterEmail: function (value, scope, element, attrs) {
                if (value) {
                    var idValue = element.attr('data-value-id');
                    console.log('asas');
                    return $injector.get('CommonService').checkUniqueValue('User', 'email', value, idValue)
                        .then(function (unique) {
                            return unique.data.isUnique;
                        });
                }
                else
                    return true;
            }
        }).setDefaultMsg({
            error: {
                error: 'Email is already taken',
                success: 'Email is available!'
            }
        });
    }]);
