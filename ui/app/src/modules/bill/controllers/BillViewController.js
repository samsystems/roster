'use strict';

angular.module('sale').controller('BillViewController', ['$scope', '$rootScope', 'dialogs', '$state', 'toaster', '$stateParams', 'config', 'DateTimeService', 'Invoice', '$timeout', function ($scope, $rootScope, dialogs, $state, toaster, $stateParams, config, DateTimeService, Invoice, $timeout) {

    $scope.invoice = {};
    $scope.Status = '';
    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
   if (id != null) {
       $scope.invoice = Invoice.$find(id).$then(function () {
            $scope.invoice.itemProducts.$fetch().$asPromise().then(function (response) {
                for (var i = 0; i < response.length; i++) {
                    response[i].Product.Price = parseFloat(response[i].Product.Price);
                    response[i].Quantity = parseInt(response[i].Quantity);

                }
                $scope.InvoiceProducts = response;

            })
           $scope.Status = $scope.invoice.Status;
        });
    }


    $scope.removeInvoice = function(invoice) {
        dialogs.confirm('Remove a Invoice', 'Are you sure you want to remove a Invoice?').result.then(function(btn){
            invoice.$destroy().$then(function () {
                $rootScope.$broadcast('invoice::deleted');
                toaster.pop('success', 'Invoice Deleted', 'You have successfully deleted a invoice.')
            });
            $state.go("app.sale");
        });
    };


}]);