'use strict';

angular.module('product').factory('PurchaseOrder', ['restmod','$http','config', function(restmod, $http, config) {

    return restmod.model('/purchase').mix({
        $config: { primaryKey: 'Id' },
        $extend: {
            Record: {

            },
            Model: {
                count: function(search) {
                    var keyword = (!_.isUndefined(search.keyword)) ? search.keyword :null;
                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/purchase/count',
                        params: { keyword: keyword, status: search.status }
                    });
                },
                getResume: function(status) {
                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/purchase/resume/'+status
                    });
                }
            }
        }
    });
}]);