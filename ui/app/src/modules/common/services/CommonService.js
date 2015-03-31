'use strict';

angular.module('common').factory('CommonService', ['$http', '$resource', '$window', 'config', function ($http, $resource, $window, config) {
    return {
        checkUniqueValue: function (key, property, value, idValue) {
            var data = {
                key: key,
                property: property,
                value: value,
                idValue: idValue
            };
            return $http({
                method: 'GET',
                url: config.api.baseUrl + '/common/is-unique-value/'+key+'/' + property + '/' + value + '/' + idValue
            });
        }
    }
}]);