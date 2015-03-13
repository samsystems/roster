'use strict';

angular.module('vendor').controller('VendorViewController', ['$scope', '$rootScope', 'dialogs', '$state', 'toaster', '$stateParams', 'config', 'Vendor','Country','State',
    function ($scope, $rootScope, dialogs, $state, toaster, $stateParams, config, Vendor, Country, State) {

    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
    $scope.vendor = {};

    if(id != null){
        $scope.vendor = Vendor.$find(id).$then(function(){
           // $scope.vendor.Country = Country.$find($scope.vendor.Country.Iso);
          // $scope.Location.State = State.$find($scope.vendor.Location.State.Id);
            $scope.vendor.contacts.$fetch();
        });
    }


    $scope.removeVendor = function(vendor) {
        dialogs.confirm('Remove a Vendor', 'Are you sure you want to remove a Vendor?').result.then(function(btn){
            vendor.$destroy().$asPromise().then(function (response) {
                $rootScope.$broadcast('vendor::deleted');
                toaster.pop('success', 'Vendor Deleted', 'You have successfully deleted a vendor.')
            });
            $state.go("app.vendor");
        });
    };

}]);