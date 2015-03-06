'use strict';

angular.module('customer').factory('CustomerContact', ['restmod','$http','config', function(restmod, $http, config) {

    return restmod.model('/customer').mix({
        $config: { primaryKey: 'Id' },
        $extend: {
            Record: {

            },
            Model: {

            }
        }
    });
}]);