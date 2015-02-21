'use strict';

angular.module('vendor').controller('VendorController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Vendor', 'ngTableParams', '$filter', '$q','$state',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Vendor, ngTableParams, $filter, $q, $state) {

    $scope.page = 1;
    $scope.total = 0;
    $scope.search = {vendor : ""};

    $scope.limitInPage = config.application.limitInPage;

    $scope.search = function(term) {
        $scope.vendorTable.reload();
    };

    $scope.refresh = function() {
        $scope.searchVendor = '';
    };

    $scope.vendorTable = new ngTableParams({
        page: 1,            // show first page
        count: 20           // count per page
    }, {
        total: 0, // length of data
        getData: function ($defer, params) {
            var vendors = Vendor.$search({page: params.page(), sort: params.orderBy(), keyword: $scope.search.vendor});
            var total = Vendor.count($scope.search.vendor);
            $q.all([vendors.$asPromise(), total]).then(function (data) {
                $scope.total = data[1].data.total;
                params.total(data[1].data.total);
                $defer.resolve(data[0]);
            })
        }
    });
    $scope.viewVendor = function(vendor){
        $state.go('app.vendor-view',{id : vendor.Id});
    }
    $scope.editVendor = function(vendor){
        $state.go('app.vendor-update',{id : vendor.Id});
    }
    $rootScope.$on('vendor::deleted', function ($event) {
        $scope.vendorTable.reload();
    });

    $scope.removeVendor = function (vendor) {
        dialogs.confirm('Remove a Vendor', 'Are you sure you want to remove a Vendor?').result.then(function(btn){
            vendor.$destroy().$asPromise().then(function (response) {
                $rootScope.$broadcast('vendor::deleted');
                toaster.pop('success', 'Vendor Deleted', 'You have successfully deleted a vendor.')
            });
        });
    };
}]);