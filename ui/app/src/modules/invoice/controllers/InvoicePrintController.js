'use strict';

angular.module('invoice').controller('InvoicePrintController', ['$scope', '$rootScope', 'dialogs', '$state', 'toaster', '$stateParams', 'config', 'DateTimeService', 'Invoice','$print', function ($scope, $rootScope, dialogs, $state, toaster, $stateParams, config, DateTimeService, Invoice,$print) {

    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
    $scope.invoice = {};

    if (id != null) {
        $scope.invoice = Invoice.$find(id);
    }
    $scope.printInvoice = function (printHTML) {
        var html=document.getElementById(printHTML).innerHTML;
        $print.html(html);
    };
}]);