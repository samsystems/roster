'use strict';

angular.module('vendor').factory('VendorContact', ['restmod','$http','config', function(restmod, $http, config) {

    return restmod.model('/vendor').mix({
        $config: { primaryKey: 'Id' },
        $extend: {
            Record: {

            },
            Model: {

            }
        }
    });
}]);