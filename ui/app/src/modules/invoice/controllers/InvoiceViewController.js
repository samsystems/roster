'use strict';

angular.module('invoice').controller('InvoiceViewController', ['$scope', '$rootScope', 'dialogs', '$state', 'toaster', '$stateParams', 'config', 'DateTimeService', 'Invoice', function ($scope, $rootScope, dialogs, $state, toaster, $stateParams, config, DateTimeService, Invoice) {

    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
    $scope.invoice = {};

    if(id != null){
        $scope.invoice = Invoice.$find(id);
        $scope.invoice.products.$fetch().$asPromise().then(function (response) {
            for (var i = 0; i < response.length; i++) {
                response[i].Product.Price = parseFloat(response[i].Product.Price);
                response[i].Quantity = parseInt(response[i].Quantity);
            }
            $scope.invoice.InvoiceProducts =  response;
        })
    }


    $scope.removeInvoice = function(invoice) {
        dialogs.confirm('Remove a Invoice', 'Are you sure you want to remove a Invoice?').result.then(function(btn){
            invoice.$destroy().$asPromise().then(function (response) {
                $rootScope.$broadcast('invoice::deleted');
                toaster.pop('success', 'Invoice Deleted', 'You have successfully deleted a invoice.')
            });
            $state.go("app.sale");
        });
    };


}]);