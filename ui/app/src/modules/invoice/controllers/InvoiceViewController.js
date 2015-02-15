'use strict';

angular.module('invoice').controller('InvoiceViewController', ['$scope', '$rootScope', 'dialogs', '$state', 'toaster', '$stateParams', 'config', 'DateTimeService', 'Invoice', function ($scope, $rootScope, dialogs, $state, toaster, $stateParams, config, DateTimeService, Invoice) {

    var InvoiceResource         = Invoice.resource;

    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
    $scope.invoice = {};

    if(id != null){
        $scope.invoice = InvoiceResource.get({id: id});
    }


    $scope.removeInvoice = function(invoice) {
        dialogs.confirm('Remove a Invoice', 'Are you sure you want to remove a Invoice?').result.then(function(btn){
            invoice.$delete({id: invoice.id}, function (response) {
                $rootScope.$broadcast('invoice::deleted');
                toaster.pop('success', 'Invoice Deleted', 'You have successfully deleted a invoice.')
            });
            $state.go("app.sale");
        });
    };


}]);