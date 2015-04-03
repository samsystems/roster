'use strict';

angular.module('product').controller('ReviewProductController', ['$scope', '$rootScope', 'dialogs', '$state', 'toaster', '$stateParams', 'config', 'Product','Country','State', 'Account','Location',
    function ($scope, $rootScope, dialogs, $state, toaster, $stateParams, config, Product, Country, State, Account, Location) {

    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
        $scope.product = {};

    if(id != null){
        $scope.product = Product.$find(id).$then(function(){
            if(!_.isNull($scope.product.SaleAccount))
                $scope.product.SaleAccount = Account.$find($scope.product.SaleAccount.Id);
            if(!_.isNull($scope.product.PurchaseAccount))
                $scope.product.PurchaseAccount = Account.$find($scope.product.PurchaseAccount.Id);
        });
        $scope.product.variations.$fetch().$then(function(){
            for(var i = 0; i < $scope.product.variations.length; i++){
                if(!_.isNull($scope.product.variations[i].Location))
                    $scope.product.variations[i].Location =  Location.$find($scope.product.variations[i].Location.Id);
            }
        });
    }


    $scope.removeProduct = function(product) {
        dialogs.confirm('Remove a Product', 'Are you sure you want to remove a Product?').result.then(function(btn){
            product.$destroy().$asPromise().then(function (response) {
                $rootScope.$broadcast('product::deleted');
                toaster.pop('success', 'Product Deleted', 'You have successfully deleted a product.')
            });
            $state.go("app.product");
        });
    };

}]);