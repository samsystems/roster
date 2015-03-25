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
    'ngRoute',
    'ngSanitize',
    'pascalprecht.translate'
])
.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$validationProvider', '$injector', function ($stateProvider, $urlRouterProvider, $translateProvider, $validationProvider, $injector) {
    $stateProvider
        .state('app.user', {
            url: 'users',
            templateUrl: 'src/modules/user/views/user.html',
            controller: 'UserController'
        });

    // Module translations
    $translateProvider.translations('en', {});
    $translateProvider.preferredLanguage('en');

    $validationProvider.setExpression({
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
    });
}]);

