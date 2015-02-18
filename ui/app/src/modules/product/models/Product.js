'use strict';

angular.module('product').factory('Product', ['restmod','$http','config', function(restmod, $http, config) {

    return restmod.model('/product').mix({
        $config: { primaryKey: 'Id' },
        $extend: {
            Record: {
                getId: function () {
                    return this.Id;
                },
                getName: function () {
                    return this.Name;
                },
                getDescription: function () {
                    return this.Description;
                },
                getManufacturer: function () {
                    return this.Manufacturer;
                },
                getStatus: function () {
                    return this.Status;
                },
                getStock: function () {
                    return this.Stock;
                },
                getPrice: function () {
                    return this.Price;
                },
                getSize: function () {
                    return this.Size;
                },
                getSku: function () {
                    return this.Sku;
                },
                getSerial: function () {
                    return this.Serial;
                }
            },
            Model: {
                count: function(search) {
                    var keyword = (!_.isUndefined(search)) ? search :null;
                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/product/count',
                        params: { keyword: keyword }
                    });
                }
            }
        }
    });
}]);