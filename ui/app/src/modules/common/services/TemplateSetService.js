'use strict';

angular.module('common').factory('TemplateSetService', ['$resource', 'config', function($resource, config){

    var service = {};

    service.resource = $resource(config.api.baseUrl + '/templates', {}, {
        'findByType' : {
            method: 'GET',
            isArray: true,
            url: config.api.baseUrl + '/templates/search-by-type/:type',
            params: {
                type: '@type'
            }
        }
    });

    return service;
}]);