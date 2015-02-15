'use strict';

angular.module('product').controller('ProductFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Product',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, Product) {

    $scope.statuses = [
        {"value": 2, "description": "Inactive"},
        {"value": 1, "description": "Active"}
    ];
    $scope.product = {};
    if(!_.isUndefined($stateParams.id)){
        $scope.product = Product.$find($stateParams.id);
    }
    $scope.save = function() {
        //$validation.validate($scope, 'product').success(function() {

            if(!_.isUndefined($scope.product.Id)){
                $scope.product.$save().$then(function(response) {
                    $rootScope.$broadcast('product::updated');
                    toaster.pop('success', 'Product Updated ', 'You have been successfully updated a product.')
                });
            }else{
                var product         = Product.$build();
                product.Name        = $scope.product.Name;
                product.Status      = $scope.product.Status;
                product.Description = $scope.product.Description;
                product.Manufacturer = $scope.product.Manufacturer;
                product.Size        = $scope.product.Size;
                product.Sku        = $scope.product.Sku;
                product.Serial        = $scope.product.Serial;
                product.Price       = $scope.product.Price;
                product.Stock       = $scope.product.Stock;

                product.$save().$then( function(response) {
                    $rootScope.$broadcast('product::created');
                    toaster.pop('success', 'Product Created', 'You have successfully created a new product.');
                }, function() {
                    toaster.pop('error', 'Error', 'Something went wrong a new Product could not be created');
                });
            }
            //$scope.$goTo($scope.step.list);
        //}).error(function() {
        //    toaster.pop('error', 'Error', 'Complete the required entry fields.');
        //});
    };
}]);