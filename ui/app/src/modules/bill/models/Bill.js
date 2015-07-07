'use strict';

angular.module('bill').factory('Bill', ['restmod', 'config','$http', function (restmod, config, $http) {

    return restmod.model('/bill').mix('BaseModel', {
        $config: { primaryKey: 'Id' },
        itemProducts: { hasMany: 'BillItem'},
        $extend: {
            Record: {
                getId: function() {
                    return this.Id;
                }
            },
            Collection: {
                count: function () {
                    return this.length;
                },
                getTotal: function() {
                    var total = 0;
                    for (var i = 0; i < this.length; i++) {
                        total += this[i].Amount;
                    }
                    return total;
                }
            },
            Model: {
                maxOrderNumber: function(type) {
                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/bill/'+type+'/max-ordernumber'

                    });
                },
                getResume: function(status) {
                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/bill/resume/'+status
                    });
                },
                count: function(status,search) {
                    var keyword = (!_.isUndefined(search)) ? search :null;
                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/bill/count',
                        params: { status:status,keyword: keyword }
                    });
                },
                items: function(idBill) {
                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/bill/'+idBill+'/products'
                    });
                }
            }
         }
    });

}]);