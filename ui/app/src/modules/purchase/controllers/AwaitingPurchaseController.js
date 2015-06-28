'use strict';

angular.module('purchase').controller('AwaitingPurchaseController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'User','ngTableParams', 'PurchaseOrder','$q','$state', '$timeout',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, User, ngTableParams, PurchaseOrder, $q,$state, $timeout) {

        $scope.page = 1;
        $scope.search = {purchaseOrder: ""};

        $scope.limitInPage = config.application.limitInPage;

        $scope.search = function(term) {
            $scope.purchaseAwaitingTable.reload()
        };

        $scope.refresh = function() {
            $scope.search.purchaseOrder = '';
        };

        $scope.purchaseAwaitingTable = new ngTableParams({
            page: 1,            // show first page
            count: 5           // count per page
        }, {
            total: 0, // length of data
            getData: function($defer, params) {
                var purchases = PurchaseOrder.$search({keyword: $scope.search.purchaseOrder, page: params.page(), sort: params.orderBy(), status: $scope.status.awaiting});
                $scope.total = PurchaseOrder.count({keyword: $scope.search.purchaseOrder, status: $scope.status.awaiting});

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
            $scope.purchaseAwaitingTable.reload();
        });

        $rootScope.$on('purchaseOrder::changeStatus', function() {
            $scope.purchaseAwaitingTable.reload();
        });


        $scope.removeProduct = function(purchaseOrder) {
            dialogs.confirm('Remove a Purchase Order', 'Are you sure you want to remove a Purchase Order?').result.then(function(btn){
                purchaseOrder.$destroy().$then(function () {
                    $rootScope.$broadcast('purchaseOrder::deleted');
                    toaster.pop('success', 'Purchase Order Deleted', 'You have successfully deleted a purchase.')
                });
            });
        };


        $scope.approve = function (purchases) {
            purchases = Object.keys(purchases).map(function (key) {
                if (purchases[key]['checked']) return {Id: key, 'Status': purchases[key]['Status']}
            });
            var count = 0;
            var marcado = [];
            var status = [];
            angular.forEach(
                purchases,
                function (purchase) {
                    if (purchase) {
                        marcado[count] = purchase.Id;
                        status[count] = purchase.Status;
                        count++;
                    }
                });

            if (marcado.length > 0) {
                console.log(marcado.length);
                dialogs.confirm('Change Status', 'Are you sure you want to change de status of Purchases?').result.then(function (btn) {
                    for (var i = 0; i < marcado.length; i++) {
                            PurchaseOrder.$find(marcado[i]).$asPromise().then(function (response) {
                                response.Status = 'approved';
                                response.$save().$then(function (response) {
                                $rootScope.$broadcast('purchaseOrder::changeStatus');
                                $rootScope.$broadcast('purchaseOrder::totalTab');
                            });
                        });
                    }
                    $timeout(function () {
                        toaster.pop('success', 'Purchase Update', 'You have been successfully updated a purchase.');
                    });
                });
            }
        };

        $scope.checkboxes = { PurchaseProducts: {} };
    }]);