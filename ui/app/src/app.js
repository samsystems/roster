'use strict';

/**
 * @ngdoc overview
 * @name inventory
 * @description
 *
 * Main module of the application.
 */
angular.module('inventory', [
    'ngAnimate',
    'ngRoute',
    'ngSanitize',
    'ngResource',
    'restmod',
    'highcharts-ng',
    'ui.router',
    'ui.bootstrap',
    'toaster',
    'ngTagsInput',
    'angular-loading-bar',
    'mgo-angular-wizard',
    'ui.keypress',
    'pascalprecht.translate',
    'dialogs.main',
    'validation',
    'validation.rule',
    'ui.multiselect',
    'angularFileUpload',
    'config',
    'common',
    'dashboard',
    'product',
    'vendor',
    'invoice',
    'contact',
    'customer',
    'company',
    'notification',
    'profile',
    'group',
    'user',
    'purchase',
    'sale',
    'magento',
    'ngTable',
    'oitozero.ngSweetAlert'
])
.config(['$httpProvider', '$translateProvider', 'restmodProvider', 'config', function($httpProvider, $translateProvider, restmodProvider, config){
    $httpProvider.interceptors.push('TokenInterceptor');

    $translateProvider.translations('en_US',{
        DIALOGS_ERROR: "Error",
        DIALOGS_ERROR_MSG: "An unknown error has occurred.",
        DIALOGS_CLOSE: "Close",
        DIALOGS_PLEASE_WAIT: "Please Wait",
        DIALOGS_PLEASE_WAIT_ELIPS: "Please Wait...",
        DIALOGS_PLEASE_WAIT_MSG: "Waiting on operation to complete.",
        DIALOGS_PERCENT_COMPLETE: "% Complete",
        DIALOGS_NOTIFICATION: "Notification",
        DIALOGS_NOTIFICATION_MSG: "Unknown application notification.",
        DIALOGS_CONFIRMATION: "Confirmation",
        DIALOGS_CONFIRMATION_MSG: "Confirmation required.",
        DIALOGS_OK: "OK",
        DIALOGS_YES: "Yes",
        DIALOGS_NO: "No"
    });

    // Module translations
    $translateProvider.useLoader('LanguageAsyncLoaderService');
    $translateProvider.preferredLanguage('en_US');

    // Api configuration
    restmodProvider.rebase({
        $config: {
            primaryKey: "id",
            style: "ams",
            urlPrefix: config.api.baseUrl
        }
    });
}])
.run(['$rootScope', 'config', '$interval', '$window', '$templateCache', 'toaster', function($rootScope, config, $interval, $window, $templateCache, toaster) {

    $window.sessionStorage.timezone = config.application.defaultTimezone;

    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
        $rootScope.state = toState.name;
    });

    $rootScope.featureLocked = function() {
        toaster.pop('info', 'Feature Locked', 'This feature is locked.');
    };

}]);
