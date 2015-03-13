'use strict';

angular.module('sale').controller('SaleFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Product', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, Product) {

    var productResource = Product.resource;

    $scope.currencies = [
        {"value": "USD", "description": "USD United State"}
    ];

    $scope.save = function() {
        $validation.validate($scope, 'purchase').success(function() {

//            if(!_.isUndefined($scope.product.id)){
//                $scope.product.$update({id: $scope.product.id}, function(response) {
//                    $rootScope.$broadcast('product::updated', response);
//                    toaster.pop('success', 'Product Updated ', 'You have been successfully updated a product.')
//                });
//            }else{
//
//                var product         = new productResource();
//                product.name        = $scope.product.name;
//                product.status      = $scope.product.status;
//                product.description = $scope.product.description;
//                product.manufacturer = $scope.product.manufacturer;
//                product.size        = $scope.product.size;
//                product.price       = $scope.product.price;
//                product.stock       = $scope.product.stock;
//
//                product.$save({}, function(response) {
//                    $rootScope.$broadcast('product::created', response);
//                    toaster.pop('success', 'Product Created', 'You have successfully created a new product.');
//                }, function() {
//                    toaster.pop('error', 'Error', 'Something went wrong a new Product could not be created');
//                });
//            }
            $scope.$goTo($scope.step.list);
        }).error(function() {
            toaster.pop('error', 'Error', 'Complete the required entry fields.');
        });
    };
}]);