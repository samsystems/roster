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
                getCategory: function () {
                    return this.Category;
                },
                getStringCategory: function () {
                    return (this.Category == 1) ? "Product" : "Service";
                },
                getStock: function () {
                    return this.Stock;
                },
                getPrice: function () {
                    return this.Price;
                },
                getCost: function () {
                    return this.Cost;
                },
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