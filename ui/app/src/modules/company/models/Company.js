'use strict';

angular.module('company').factory('Company', ['restmod', '$window', 'config','$http', function(restmod, $window, config, $http) {
    return restmod.model('/company').mix({
        $config: { primaryKey: 'Id' },
        $extend: {
            Model: {
                count: function(search) {
                    var keyword = (!_.isUndefined(search)) ? search :null;
                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/company/count',
                        params: { keyword: keyword }
                    });
                }
            }
        }
    });

}]);