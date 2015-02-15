'use strict';

angular.module('common').factory('DocumentService', ['$resource', 'config', function($resource, config){

    var service = {};

    service.resource = $resource(config.api.baseUrl + '/documents', {}, {
        'get' : {
            method: 'GET',
            isArray: false,
            url: config.api.baseUrl + '/documents/:id',
            params: {
                id: '@id'
            }
        },
        'delete' : {
            method: 'DELETE',
            url: config.api.baseUrl + '/documents/:id',
            params: {
                id: '@id'
            }
        }
    });

    return service;
}]);