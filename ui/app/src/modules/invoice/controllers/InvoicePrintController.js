'use strict';

angular.module('invoice').controller('InvoicePrintController', ['$scope', '$rootScope', 'dialogs', '$state', 'toaster', '$stateParams', 'config', 'DateTimeService', 'Invoice','$print', 'Country', function ($scope, $rootScope, dialogs, $state, toaster, $stateParams, config, DateTimeService, Invoice,$print, Country) {

    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
    $scope.invoice = {};

    if (id != null) {
        $scope.invoice = Invoice.$find(id).$then(function(){
            $scope.invoice.products.$build().$reveal();
            //$scope.invoice.Customer.Country = Country.$find($scope.invoice.Customer.Country.Iso);
        });

        $scope.invoice.products.$fetch().$asPromise().then(function (response) {
            for (var i = 0; i < response.length; i++) {
                response[i].Product.Price = parseFloat(response[i].Product.Price);
                response[i].Quantity = parseInt(response[i].Quantity);

            }
            $scope.InvoiceProducts =  response;

        })
    }
    $scope.printInvoice = function (printHTML) {
        var html=document.getElementById(printHTML).innerHTML;
        $print.html(html);
    };
}]);