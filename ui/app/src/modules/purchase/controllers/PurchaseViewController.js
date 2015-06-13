'use strict';

angular.module('purchase').controller('PurchaseViewController', ['$scope', '$rootScope', '$stateParams', 'config', '$validation', 'toaster', '$upload', 'PurchaseOrder', 'Location', 'dialogs', '$state',
function ($scope, $rootScope, $stateParams, config, $validation, toaster, $upload, PurchaseOrder, Location, dialogs, $state) {

    $scope.purchase = {};
    $scope.Status = '';

    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;

    if (id != null) {
        $scope.purchase = PurchaseOrder.$find(id).$then(function () {
            $scope.purchase.products.$fetch().$asPromise().then(function (response) {
                for (var i = 0; i < response.length; i++) {
                    response[i].Product.Price = parseFloat(response[i].Product.Price);
                    response[i].Quantity = parseInt(response[i].Quantity);

                }
                $scope.PurchaseProducts = response;

            })

            $scope.locationSupplier = Location.$find($scope.purchase.Supplier.Location.Id);
            $scope.Status = $scope.purchase.Status;
        });
    }

    $scope.getAmount = function (item) {
        var quantity = (!isNaN(item.Quantity) && item.Quantity != "") ? parseInt(item.Quantity) : 0;
        var price = (!isNaN(item.Price) && item.Price != "") ? parseFloat(item.Price) : 0;
        var discount = (!isNaN(item.DiscountPrice) && item.DiscountPrice != "") ? parseFloat(item.DiscountPrice) : 0;
        return  ( quantity * price ) - ( quantity * price * discount / 100);
    }

    $scope.removePurchase = function(purchase) {
        dialogs.confirm('Remove a Purchase', 'Are you sure you want to remove a Purchase?').result.then(function(btn){
            purchase.$destroy().$then(function () {
                $rootScope.$broadcast('purchase::deleted');
                toaster.pop('success', 'Purchase Deleted', 'You have successfully deleted a purchase.')
            });
            $state.go("app.purchaseOrder");
        });
    };
}]);