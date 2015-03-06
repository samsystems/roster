'use strict';

angular.module('product').factory('ProductVariation', ['restmod', function(restmod) {

    return restmod.model('/product-variation').mix({
        $config: { primaryKey: 'Id' },
        $extend: {
            Record: {

            },
            Model: {
                count: function(search) {
                    var keyword = (!_.isUndefined(search)) ? search :null;
                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/product-variation/count',
                        params: { keyword: search}
                    });
                }
            }
        }
    });
}]);