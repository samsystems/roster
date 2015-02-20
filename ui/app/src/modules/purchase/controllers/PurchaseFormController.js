'use strict';

angular.module('purchase').controller('PurchaseFormController', ['$scope', '$rootScope', '$stateParams', '$location', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Product', 'PurchaseOrder', 'PurchaseOrderItem',
    function ($scope, $rootScope, $stateParams, $location, config, $modal, dialogs, DateTimeService, toaster, $validation, Product, PurchaseOrder, PurchaseOrderItem ) {

    $scope.currencies = [
        {"value": "USD", "description": "USD United State"},
    ];

    $scope.purchase = {};
    if(!_.isUndefined($stateParams.id)){
        $scope.purchase = PurchaseOrder.$find($stateParams.id);
    }else{
        $scope.purchase = PurchaseOrder.$build();
        $scope.purchase.products.$build().$reveal();
    }

    $scope.save = function() {
//        $validation.validate($scope, 'purchase').success(function() {

            if(!_.isUndefined($scope.purchase.Id)){
                $scope.purchase.$save().$then(function(response) {
                    $rootScope.$broadcast('product::updated');
                    toaster.pop('success', 'Product Updated ', 'You have been successfully updated a product.')
                });
            }else{
                $scope.purchase.$save().$then( function(response) {
                    $rootScope.$broadcast('product::created');
                    toaster.pop('success', 'Product Created', 'You have successfully created a new product.');
                }, function() {
                    toaster.pop('error', 'Error', 'Something went wrong a new Product could not be created');
                });
            }

//        }).error(function() {
//            toaster.pop('error', 'Error', 'Complete the required entry fields.');
//        });
    };

    $scope.addProduct = function(index){
        if(index == $scope.purchase.products.length - 1)
            $scope.purchase.products.$build().$reveal();
    }

    $scope.removeProduct = function(product){
        $scope.purchase.products.$remove(product);
    }

    $scope.getAmount = function(product){
        var quantity = (!isNaN(product.QuantitySolicited) && product.QuantitySolicited != "") ? parseInt(product.QuantitySolicited) : 0;
        var price = (!isNaN(product.Price) && product.Price != "") ? parseFloat(product.Price) : 0;
        var discount = (!isNaN(product.DiscountPrice) && product.DiscountPrice != "") ? parseFloat(product.DiscountPrice) : 0;
        return  ( quantity * price ) - ( quantity * price * discount / 100);
    }

    $scope.getTotal = function(product){
        var total = 0;
        var tax = (!isNaN($scope.purchase.TotalTax) && $scope.purchase.TotalTax != "") ? parseInt($scope.purchase.TotalTax) : 0;
        _.each($scope.purchase.products,function(product){
            total += $scope.getAmount(product);
        })
        $scope.total = total;
        return  ( total) + ( total * tax / 100);
    }

    $scope.cancel = function() {
        $location.path("purchase");
    };
}]);