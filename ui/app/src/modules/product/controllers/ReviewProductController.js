'use strict';

angular.module('product').controller('ReviewProductController', ['$scope', '$rootScope', 'dialogs', '$state', 'toaster', '$stateParams', 'config', 'Product','Country','State',
    function ($scope, $rootScope, dialogs, $state, toaster, $stateParams, config, Product, Country, State) {

    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
        $scope.product = {};

    if(id != null){
        $scope.product = Product.$find(id).$then(function(){
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