'use strict';

angular.module('vendor').controller('VendorViewController', ['$scope', '$rootScope', 'dialogs', '$state', 'toaster', '$stateParams', 'config', 'DateTimeService', 'Vendor', 'Contact', function ($scope, $rootScope, dialogs, $state, toaster, $stateParams, config, DateTimeService, Vendor, Contact) {

    var VendorResource         = Vendor.resource;
    var contactResource         = Contact.resource;

    $scope.page = 1;

    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
    $scope.vendor = {};

    if(id != null){
        $scope.contacts = contactResource.findAll({owner : 'vendor',idowner : id,page : $scope.page});
        $scope.vendor = VendorResource.get({id: id});
    }


    $scope.removeVendor = function(vendor) {
        dialogs.confirm('Remove a Vendor', 'Are you sure you want to remove a Vendor?').result.then(function(btn){
            vendor.$delete({id: vendor.id}, function (response) {
                $rootScope.$broadcast('vendor::deleted');
                toaster.pop('success', 'Vendor Deleted', 'You have successfully deleted a vendor.')
            });
            $state.go("app.vendor");
        });
    };

}]);