'use strict';

angular.module('customer').factory('Customer', ['restmod', '$window', 'config','$http', function(restmod, $window, config, $http) {

    return restmod.model('/customer').mix({
        contacts: { hasMany: 'CustomerContact'},
        $config: { primaryKey: 'Id' },
        $extend: {
            Model: {
                count: function(search) {
                    var keyword = (!_.isUndefined(search)) ? search :null;
                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/customer/count',
                        params: { keyword: keyword }
                    });
                }
            }
        }
    });
}]);