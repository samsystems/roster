'use strict';

angular.module('purchase').controller('AllPurchaseController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'User','ngTableParams', 'PurchaseOrder','$q','$state', '$location',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, User, ngTableParams, PurchaseOrder, $q, $state, $location) {

    $scope.page = 1;
    $scope.search = {purchaseOrder: ""};

    $scope.limitInPage = config.application.limitInPage;

    $scope.search = function(term) {
        $scope.purchaseAllTable.reload()
    };

    $scope.refresh = function() {
        $scope.search.purchaseOrder = '';
    };

    $scope.purchaseAllTable = new ngTableParams({
        page: 1,            // show first page
        count: 5           // count per page
    }, {
        total: 0, // length of data
        getData: function($defer, params) {
            var purchases = PurchaseOrder.$search({keyword: $scope.search.purchaseOrder, page: params.page(), sort: params.orderBy(), status: $scope.status.all});
            $scope.total = PurchaseOrder.count({keyword: $scope.search.purchaseOrder, status: $scope.status.all});

            $q.all([purchases.$asPromise(), $scope.total]).then(function (data) {
                params.total(data[1].data.total);
                $defer.resolve(data[0]);
            })
        }
    });

    $scope.viewPurchase = function(purchaseOrder){
        $state.go('app.purchaseOrder-view',{id : purchaseOrder.Id});
    }
    $scope.selectPurchase = function(purchaseOrder){
        $state.go('app.purchaseOrder-update',{id : purchaseOrder.Id});
    }

    $rootScope.$on('purchaseOrder::deleted', function() {
        $scope.purchaseAllTable.reload();
    });

    $scope.removeProduct = function(purchaseOrder) {
        dialogs.confirm('Remove a Purchase Order', 'Are you sure you want to remove a Purchase Order?').result.then(function(btn){
            purchaseOrder.$destroy().$then(function () {
                $rootScope.$broadcast('purchaseOrder::deleted');
                $rootScope.$broadcast('purchaseOrder::totalTab');
                toaster.pop('success', 'Purchase Order Deleted', 'You have successfully deleted a purchase.')
            });
        });
    };

     $scope.print = function (purchases) {
         purchases = Object.keys(purchases).map(function (key) {
             if (purchases[key]['checked']) return key
         });
         var count_check = 0;
         var marcado = null;
         angular.forEach(
             purchases,
             function (purchase) {
                 if (purchase) {
                     marcado = purchase;
                     count_check++;
                     console.log(count_check);
                     if (count_check > 1) {
                         toaster.pop('error', 'Error', 'Select only one purchase');
                         return;
                     }
                 }
             });
         if (count_check == 1) {
             $location.path("/purchase/print/" + marcado);
         }
        };


        $scope.checkboxes = { PurchaseProducts: {} };
}]);