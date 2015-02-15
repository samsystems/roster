'use strict';

angular.module('dashboard').controller('DashboardController', ['$scope', '$http', '$window', '$rootScope', '$stateParams', 'config', 'DateTimeService', 'User', 'Customer', 'Invoice', 'Product', function ($scope, $http, $window, $rootScope, $stateParams, config, DateTimeService, User, Customer, Invoice, Product) {

    $scope.date = DateTimeService.now();

    $scope.dashboard = {
        totalCustomers: Customer.$search().count(),
        totalProducts:  Product.count(),
        totalOrders: 20
    };
    Invoice.getResume('all').success(function (response) {
        $scope.dashboard.totalInvoices = response.amount;
    });
}]);