'use strict';

angular.module('purchase').controller('PurchasePrintController', ['$scope', '$rootScope', 'dialogs', '$state', 'toaster', '$stateParams', 'config', 'DateTimeService', 'PurchaseOrder', '$print', 'Location',
    function ($scope, $rootScope, dialogs, $state, toaster, $stateParams, config, DateTimeService, PurchaseOrder, $print, Location) {
    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
    $scope.purchase = {};

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
        });
    }

    $scope.printPurchase = function (printHTML) {
        var html = document.getElementById(printHTML).innerHTML;
        $print.html(html);
    };
}]);