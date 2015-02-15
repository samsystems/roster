'use strict';

/**
 * @ngdoc overview
 * @name Group
 * @description
 * The Group module groups users into modules that defines permissions or statuses on the ship.
 *
 */
angular.module('group', [
        'ngRoute',
        'ngSanitize',
        'pascalprecht.translate'
    ])
    .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function ($stateProvider, $urlRouterProvider, $translateProvider) {
        $stateProvider
            .state('app.group', {
                url: 'group',
                templateUrl: 'src/modules/group/views/group.html',
                controller: 'GroupController'
            });

        // Module translations
        $translateProvider.translations('en', {
        });
        $translateProvider.preferredLanguage('en');
    }]);

