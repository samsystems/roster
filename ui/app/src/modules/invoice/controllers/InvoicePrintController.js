'use strict';

angular.module('invoice').controller('InvoicePrintController', ['$scope', '$rootScope', 'dialogs', '$state', 'toaster', '$stateParams', 'config', 'DateTimeService', 'Invoice','$print', function ($scope, $rootScope, dialogs, $state, toaster, $stateParams, config, DateTimeService, Invoice,$print) {

    var InvoiceResource = Invoice.resource;

    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
    $scope.invoice = {};

    if (id != null) {
        $scope.invoice = InvoiceResource.get({id: id});
    }
    $scope.printInvoice = function (printHTML) {
        var html=document.getElementById(printHTML).innerHTML;
        $print.html(html);
    };
}]);