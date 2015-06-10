'use strict';

angular.module('purchase').controller('PurchaseFormController', ['$scope', '$rootScope', '$stateParams', '$location', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Product', 'PurchaseOrder', 'PurchaseOrderItem','Vendor',
    function ($scope, $rootScope, $stateParams, $location, config, $modal, dialogs, DateTimeService, toaster, $validation, Product, PurchaseOrder, PurchaseOrderItem,Vendor ) {

    $scope.currencies = [
        {"value": "USD", "description": "USD United States Dollar"}
    ];

    $scope.purchase = {};
    if(!_.isUndefined($stateParams.id)){
        $scope.purchase = PurchaseOrder.$find($stateParams.id);
    }else{
        $scope.purchase = PurchaseOrder.$build();
        $scope.purchase.Currency = 'USD';
        $scope.purchase.products.$build().$reveal();
    }

    $scope.save = function(form) {
        $validation.validate(form).success(function () {

            if(!_.isUndefined($scope.purchase.Id)){
                $scope.purchase.$save().$then(function(response) {
                  //  $rootScope.$broadcast('product::updated');
                    toaster.pop('success', 'Purchase Updated ', 'You have been successfully updated a purchase.')
                });
            }else{
                var purchase = PurchaseOrder.$build();

                purchase.products = [];
                var count = 0;
                for (var i = 0; i < $scope.purchase.products.length; i++) {
                    if (!_.isUndefined($scope.purchase.products[i].Product))
                        if ($scope.purchase.products[i].Product.Name) {
                            purchase.products[count] = $scope.purchase.products[i];
                            count++;
                        }
                }
                if (purchase.products.length == 0) {
                    toaster.pop('error', 'Error', 'You must add at least one product.');
                    return;
                }
                purchase.Supplier=$scope.purchase.Supplier;
                purchase.Date=$scope.purchase.Date;
                purchase.DeliveryDate=$scope.purchase.DeliveryDate;
                purchase.OrderNumber=$scope.purchase.OrderNumber;
                purchase.Reference=$scope.purchase.Reference;
                purchase.Reference=$scope.purchase.Reference;
                purchase.Currency=$scope.purchase.Currency;
                purchase.TotalTax=$scope.purchase.TotalTax;
                purchase.DeliveryInstruction=$scope.purchase.DeliveryInstruction;
                purchase.$save().$then( function(response) {
                   // $rootScope.$broadcast('product::created');
                    toaster.pop('success', 'Purchase Created', 'You have successfully created a new purchase.');
                }, function() {
                    toaster.pop('error', 'Error', 'Something went wrong a new Purchase could not be created');
                });
            }

        }).error(function() {
            toaster.pop('error', 'Error', 'Complete the required entry fields.');
        });
    };

        $scope.addProduct = function (index) {
            $scope.purchase.products.$build().$reveal();
        }

        $scope.removeProduct = function (product) {
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

    $scope.searchSuppliers = function (val) {
        return Vendor.$search({keyword: val, page: 1, order: 'notSorting'}).$asPromise().then(function (vendors) {
            if (vendors == null)
                return {};
            else
                return vendors;
        });
    };
    $scope.searchProducts = function (val) {
        return Product.$search({keyword: val, page: 1, order: 'notSorting'}).$asPromise().then(function (products) {
            return products;
        });
    };
    $scope.addItem = function (product, $index) {
        if (!_.isEmpty(product) && !_.isEmpty(product.Id)) {
            $scope.subtotal = 0;

            for (var i = 0; i < $scope.purchase.products.length; i++) {

                if (!_.isEmpty($scope.purchase.products[i].Product.Id)) {
                    if ($scope.purchase.products[i].Product.Id == product.Id) {
                        toaster.pop('error', 'Error', 'The product has already been added');
                        return;
                    }
                }
            }
            var item = {Product: product, Price: product.Price, DiscountPrice: product.DiscountPrice, QuantitySolicited: '1'};
            $scope.purchase.products[$index] = item;
        } else {
            toaster.pop('error', 'Error', 'Select an item');
        }
    };
}]);