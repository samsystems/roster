'use strict';

angular.module('common').factory('ServiceService', ['$resource', 'config', function($resource, config){

    var service = {};

    service.resource = $resource(config.api.baseUrl + '/services', {}, {
        'search' : {
            method: 'GET',
            isArray: true,
            ignoreLoadingBar: true,
            url: config.api.baseUrl + '/services/search/:expression/:page',
            params: {
                expression: '@expression',
                page: '@page'
            }
        },
        'findUrinalysisByCompany' : {
            method: 'GET',
            isArray: false,
            url: config.api.baseUrl + '/services/find-urinalysis-by-company/:companyId',
            params: {
                companyId:  '@companyId'
            }
        }
    });

    return service;
}]);