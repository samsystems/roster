'use strict';

angular.module('purchase').controller('PurchaseController', ['$scope', 'PurchaseOrder', '$rootScope', '$location', '$state', 'dialogs', '$timeout', 'toaster','WorkerService',
    function ($scope, PurchaseOrder, $rootScope, $location, $state, dialogs, $timeout, toaster,WorkerService) {
        $scope.status = {
            all: 'all',
            draft: 'draft',
            awaiting: 'awaiting',
            approved: 'approved',
            billed: 'billed',
            receiving: 'receiving',
            completed: 'completed',
            void: 'void'
        }

        totalTab();
        function totalTab() {
            $scope.resume = {};
            PurchaseOrder.getResume($scope.status.draft).then(function (data) {
                $scope.resume.draft = data.data;
            });
            PurchaseOrder.getResume($scope.status.awaiting).then(function (data) {
                $scope.resume.awaiting = data.data;
            });
            PurchaseOrder.getResume($scope.status.approved).then(function (data) {
                $scope.resume.approved = data.data;
            });
            PurchaseOrder.getResume($scope.status.billed).then(function (data) {
                $scope.resume.billed = data.data;
            });

        }

        $rootScope.$on('purchaseOrder::totalTab', function () {
            totalTab();
        });


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


        $scope.copyto = function (purchases) {
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
                        if (count_check > 1) {
                            toaster.pop('error', 'Error', 'Select only one purchase');
                            return;
                        }
                    }
                });

            if (count_check == 1) {
                $scope.purchase = PurchaseOrder.$find(marcado).$then(function () {
                    $scope.purchase.Status = 'draft';
                    var id = $scope.purchase.Id;
                    $scope.purchase.Id = null;
                    $scope.purchase.products.$fetch().$asPromise().then(function (response) {
                        for (var i = 0; i < response.length; i++) {
                            response[i] = {Product: response[i].Product, Price: response[i].Product.Price, Quantity: response[i].Quantity};
                        }
                        //disable(false, $scope.purchase);
                        $scope.purchase.PurchaseProducts = response;
                    })
                    $state.go('app.purchaseOrder-copyto', {id: id, action: 'copyto'});
                });


            }
        };

        $scope.sendMailPdf = function (purchases) {
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
                        if (count_check > 1) {
                            toaster.pop('error', 'Error', 'Select only one purchase');
                            return;
                        }
                    }
                });

            if (count_check == 1) {
                $scope.purchasePdf = PurchaseOrder.$find(marcado).$then(function () {
                    $scope.purchasePdf.products.$fetch().$asPromise().then(function (response) {
                        $timeout(function () {
                            var html = document.getElementById('pdf').innerHTML;
                            WorkerService.pdf(html, true).success(function (pdf_base64) {
                                //$window.open("data:application/pdf;base64, " + pdf_base64.response, false);
                                WorkerService.sendMail('hola', {'jlborrero@gmail.com': 'Joe Luis'}, "que bola").success(function (email_result) {
                                    console.email_result;
                                });
                            });
                        });
                    });
                });
            }
        };

        $scope.removeGeneral = function (purchases) {

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
                dialogs.confirm('Remove a Purchase', 'Are you sure you want to remove the Purchases?').result.then(function (btn) {
                    for (var i = 0; i < status.length; i++) {
                        if (status[i] != 'draft') {
                            toaster.pop('error', 'Error', 'can only be removed draft purchases');
                            return;
                        }
                    }
                    for (var i = 0; i < marcado.length; i++) {
                        if (status[i] == 'draft') {
                            PurchaseOrder.$find(marcado[i]).$asPromise().then(function (responseDelete) {
                                responseDelete.$destroy().$then(function () {
                                    $rootScope.$broadcast('purchaseOrder::deleted');
                                    $rootScope.$broadcast('purchaseOrder::totalTab');
                                });
                            });
                        } else {
                            toaster.pop('error', 'Error', 'can only be removed draft purchases');
                            return;
                        }
                    }
                    $timeout(function () {
                        toaster.pop('success', 'Purchase Deleted', 'You have successfully deleted the purchases.');
                    });
                });
            }
        };


    }]);