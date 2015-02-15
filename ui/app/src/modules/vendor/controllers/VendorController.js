'use strict';

angular.module('vendor').controller('VendorController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Vendor', 'ngTableParams', '$filter', '$q','$state',
  function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Company, ngTableParams, $filter, $q, $state) {

    $scope.page = 1;
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
      count: 5           // count per page
    }, {
      total: 0, // length of data
      getData: function ($defer, params) {
        var vendors = Vendor.$search({page: params.page(), sort: params.orderBy(), keyword: $scope.search.vendor});
        $scope.total = Vendor.count($scope.search.vendor);
        $q.all([vendors.$asPromise(), $scope.total]).then(function (data) {
          params.total(data[1].data.total);
          $defer.resolve(data[0]);
        })
      }
    });

    $scope.viewVendor = function(vendor){
      $state.go('app.vendor-view',{id : vendor.Id});
    }

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

//'use strict';
//
//angular.module('vendor').controller('VendorController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'WizardHandler', 'Vendor', '$location', 'Country', 'State', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, WizardHandler, Vendor, $location, Country, State) {
//
//    $scope.countries = Country.$search();
//    $scope.states    = State.$search();
//
//    $scope.step = {
//        list:          'list',
//        form:          'form'
//    };
//
//    $scope.$goTo = function(step) {
//        WizardHandler.wizard().goTo(step);
//    };
//
//    $scope.createVendor = function() {
//        $scope.vendor = {
//            name: '',
//            category: '',
//            phone: '',
//            fax: '',
//            email: '',
//            address: '',
//            city: '',
//            zipcode: '',
//            state: '',
//            country: {"id":"US","name":"United States"},
//            notes: ''
//        };
//
//        $scope.$goTo($scope.step.form);
//    };
//
//    $scope.getList = function() {
//        $scope.$goTo($scope.step.list);
//    };
//
//    $scope.selectVendor = function(vendor) {
//        $scope.vendor = Vendor.$find(vendor.id);
//        $rootScope.contactOwner='vendor';
//        $rootScope.contactIdOwner=vendor.id;
//
//        $scope.$goTo($scope.step.form);
//    };
//
//    $scope.viewVendor = function(vendor) {
//        $location.path( "/vendor/view/"+vendor.id);
//    };
//
//    $scope.$close = function() {
//        $scope.$goTo($scope.step.list);
//    };
//}]);
