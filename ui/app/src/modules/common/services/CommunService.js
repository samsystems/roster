'use strict';

angular.module('common').factory('CommunService', ['$http', '$resource', '$window', 'config', 'BasicAuth', 'AuthenticationService', '$state', function ($http, $resource, $window, config, BasicAuth, AuthenticationService, $state) {
    return {
        checkUniqueValue: function (id, property, value, idValue) {
            var data = {
                id: id,
                property: property,
                value: value,
                idValue: idValue
            };
            return $http({
                method: 'GET',
                url: config.api.baseUrl + '/commun/is-unique-value/' + id + '/' + property + '/' + value + '/' + idValue
            });
        }
    }
}]);