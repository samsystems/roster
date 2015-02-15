'use strict';

angular.module('common').factory('PermissionService', ['$resource', 'config', function($resource, config){

    var service = {};

    service.resource = $resource(config.api.baseUrl + '/permission', {}, {
        'fetch' : {
            method: 'GET',
            isArray: true,
            url: config.api.baseUrl + '/permission/find-permissions/'
            //loadingBarText: 'Loading services'
        },
        'findById' : {
            method: 'GET',
            isArray: true,
            url: config.api.baseUrl + '/permission/find-by-id/:id',
            params:{
                id : '@id'
            }
            //loadingBarText: 'Loading services'
        }
    });

    return service;
}]);