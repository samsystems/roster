'use strict';

angular.module('product').controller('ProductController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Product','ngTableParams','$filter','$q','$state',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Product, ngTableParams,$filter, $q, $state) {

    $scope.page = 1;
    $scope.search = {product: ""};

    $scope.limitInPage = config.application.limitInPage;

    $scope.search = function(term) {
        $scope.productTable.reload()
    };

    $scope.refresh = function() {
        $scope.search.product = '';
    };

    $scope.productTable = new ngTableParams({
        page: 1,            // show first page
        count: 5           // count per page
    }, {
        total: 0, // length of data
        getData: function($defer, params) {
            var products = Product.$search({keyword: $scope.search.product, page: params.page(), sort: params.orderBy()});
            $scope.total = Product.count($scope.search.product);

            $q.all([products.$asPromise(), $scope.total]).then(function (data) {
                params.total(data[1].data.total);
                $defer.resolve(data[0]);
            })
        }
    });

    $scope.viewProduct = function(company){
        $state.go('app.product-view',{id : company.Id});
    }
    $scope.selectProduct = function(company){
        $state.go('app.product-update',{id : company.Id});
    }

    $rootScope.$on('product::deleted', function() {
        $scope.productTable.reload();
    });

    $scope.removeProduct = function(product) {
        dialogs.confirm('Remove a Product', 'Are you sure you want to remove a Product?').result.then(function(btn){
            product.$destroy().$then(function () {
                $rootScope.$broadcast('product::deleted');
                toaster.pop('success', 'Product Deleted', 'You have successfully deleted a product.')
            });
        });
    };
}]);