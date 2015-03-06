'use strict';

angular.module('product').controller('ProductFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Product','$state','Account', 'Location',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, Product, $state, Account, Location) {

    $scope.accounts = Account.$search();
    $scope.locations    = Location.$search();

    $scope.product = {};
    if(!_.isUndefined($stateParams.id)){
        $scope.product = Product.$find($stateParams.id);
        $scope.product.variations.$fetch();
    }else{
        $scope.product =  Product.$build();
    }

    $scope.addVariation = function(){
        $scope.product.variations.$build().$reveal();
    }

    $scope.removeVariations = function(product){
        $scope.product.variations.$remove(product);
    }


    $scope.save = function() {
        //$validation.validate($scope, 'product').success(function() {

            if(!_.isUndefined($scope.product.Id)){
                $scope.product.$save().$then(function(response) {
                    $rootScope.$broadcast('product::updated');
                    toaster.pop('success', 'Product Updated ', 'You have been successfully updated a product.')
                    $state.go("app.product");
                });
            }else{
                $scope.product.$save().$then( function(response) {
                    $rootScope.$broadcast('product::created');
                    toaster.pop('success', 'Product Created', 'You have successfully created a new product.');
                    $state.go("app.product");
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