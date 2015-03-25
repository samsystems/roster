'use strict';

angular.module('common').factory('CommonService', ['$http', '$resource', '$window', 'config', 'BasicAuth', 'AuthenticationService', '$state', function ($http, $resource, $window, config, BasicAuth, AuthenticationService, $state) {
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
                url: config.api.baseUrl + '/common/is-unique-value/' + id + '/' + property + '/' + value + '/' + idValue
            });
        }
    }
}]);