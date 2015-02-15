'use strict';

angular.module('vendor').controller('VendorListController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Vendor','ngTableParams','$filter','$q', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Vendor, ngTableParams,$filter, $q) {

    $scope.page = 1;
    $scope.searchVendor = '';

    $scope.limitInPage = config.application.limitInPage;
    $rootScope.contactOwner = null;
    $rootScope.contactIdOwner = null;

    $scope.search = function(term) {
        $scope.vendorTable.reload()
    };

    $scope.refresh = function() {
        $scope.searchVendor = '';
    };

    $scope.vendorTable = new ngTableParams({
        page: 1,            // show first page
        count: 5           // count per page
    }, {
        total: 0, // length of data
        getData: function($defer, params) {
            var sort = params.orderBy() != false ? params.orderBy() : 'notSorting';
            var vendors = null;
            if( !_.isUndefined($scope.searchVendor) && $scope.searchVendor != '') {
                vendors      = Vendor.$search({keyword: $scope.searchVendor, page: params.page(), order: sort});
                $scope.total = Vendor.$search({keyword: $scope.searchVendor}).count();
            }
            else {
                vendors      = Vendor.$search({page: params.page(), order: sort});
                $scope.total = Vendor.$search().count();
            }

            $q.all([vendors.$promise,$scope.total.$promise]).then(function(data){
                params.total($scope.total.count);
                $defer.resolve(data[0]);
            })
        }
    });

    $scope.$watch('searchVendor', function(data) {
        $scope.search();
    });

    $rootScope.$on('vendor::created', function(event) {
        $scope.vendorTable.reload();
    });

    $rootScope.$on('vendor::updated', function(event) {
        $scope.vendorTable.reload();
    });

    $rootScope.$on('vendor::deleted', function($event) {
        $scope.vendorTable.reload();
    });

    $scope.removeVendor = function(vendor) {
        dialogs.confirm('Remove a Vendor', 'Are you sure you want to remove a Vendor?').result.then(function(btn){
            vendor.$delete({id: vendor.id}, function (response) {
                $rootScope.$broadcast('vendor::deleted');
                toaster.pop('success', 'Vendor Deleted', 'You have successfully deleted a vendor.')
            });
        });
    };
}]);