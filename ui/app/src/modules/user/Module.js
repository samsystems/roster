'use strict';

/**
 * @ngdoc overview
 * @name Clinic
 * @description
 * The Clinic module provides users with a preview of the patients on clinic.
 *
 * Clinic module.
 */
angular.module('user', [
    'ngSanitize',
    'pascalprecht.translate'
])
    .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$validationProvider', '$injector', function ($stateProvider, $urlRouterProvider, $translateProvider, $validationProvider, $injector) {
        $stateProvider
            .state('app.user', {
                url: 'users',
                templateUrl: 'src/modules/user/views/user.html',
                controller: 'UserController'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'src/modules/user/views/register.html',
                controller: 'RegisterController'
            });

        // Module translations
        $translateProvider.translations('en', {});
        $translateProvider.preferredLanguage('en');

        /*$validationProvider.setExpression({
            uniqueRegisterEmail: function (value, scope, element, attrs) {
                if (value) {
                    var idValue = element.attr('data-value-id');
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
        });*/

     /*   $validationProvider.setExpression({
            uniqueUsername: function (value, scope, element, attrs) {
                if (value) {
                    var idValue = element.attr('data-value-id');
                    return $injector.get('CommonService').checkUniqueValue('User', 'username', value, idValue)
                        .then(function (unique) {
                            return unique.data.isUnique;
                        });
                }
                else
                    return true;
            }
        }).setDefaultMsg({
            error: {
                error: 'Username is already taken',
                success: 'Username is available!'
            }
        });*/
    }]);

