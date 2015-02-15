'use strict';

angular.module('contact').factory('Contact', ['$resource', '$window', 'config', function($resource, $window, config) {
    return {
        resource: $resource(config.api.baseUrl + '/contacts', {}, {
            'get': {
                method: 'GET',
                isArray: false,
                url: config.api.baseUrl + '/contacts/find-by-id/:owner/:id',
                params: {
                    owner: '@owner',
                    id: '@id'
                }
            },
            'findAll': {
                method: 'GET',
                isArray: true,
                url: config.api.baseUrl + '/contacts/find-all/:owner/:idowner/:page/:order',
                params: {
                    owner: '@owner',
                    idowner: '@idowner',
                    page: '@page',
                    order: '@order'
                }
            },
            'findCount': {
                method: 'GET',
                isArray: false,
                url: config.api.baseUrl + '/contacts/find-count/:owner/:idowner',
                params: {
                    owner: '@owner',
                    idowner: '@idowner'
                }
            },
            'findCountByKeyword': {
                method: 'GET',
                isArray: false,
                url: config.api.baseUrl + '/contacts/find-count/:owner/:idowner/:keyword',
                params: {
                    keyword: '@keyword'
                }
            },
            'update': {
                method: 'PUT',
                isArray: false,
                url: config.api.baseUrl + '/contacts/:owner/:id',
                params: {
                    owner: '@owner',
                    id: '@id'
                }
            },
            'findByKeyword': {
                method: 'GET',
                isArray: true,
                url: config.api.baseUrl + '/contacts/search/:owner/:idowner/:keyword/:page/:order',
                params: {
                    owner: '@owner',
                    keyword: '@keyword',
                    page: '@page',
                    order: '@order'
                }
            },
            'delete': {
                method: 'DELETE',
                isArray: false,
                url: config.api.baseUrl + '/contacts/:owner/:id',
                params: {
                    owner: '@owner',
                    id: '@id'
                }
            }
        })

    }
}]);