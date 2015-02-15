'use strict';

/**
 * @ngdoc overview
 * @name Magento
 * @description
 * Magento Integration
 *
 * Magento Integration module.
 */
angular.module('magento', [
    'ngRoute',
    'ngSanitize'
]).config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.magento', {
                url: 'magento',
                templateUrl: 'src/modules/magento/views/magento.html',
                controller: 'MagentoAccountController'
            });
}]);

