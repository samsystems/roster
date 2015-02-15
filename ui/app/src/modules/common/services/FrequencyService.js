'use strict';

angular.module('common').factory('FrequencyService', ['$resource', '$window', 'config', function($resource, $window, config){

    var service = {};

    service.resource = $resource(config.api.baseUrl + '/question-sets/', {}, {
        'findForOrders' : {
            method: 'GET',
            isArray: true,
            url: config.api.baseUrl + '/frequencies/search-for-orders',
            loadingBarText: 'Loading frequencies'
        }
    });

    return service;
}]);