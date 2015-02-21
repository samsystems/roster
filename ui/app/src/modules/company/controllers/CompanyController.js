'use strict';

angular.module('company').controller('CompanyController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Company', 'ngTableParams', '$filter', '$q','$state',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Company, ngTableParams, $filter, $q, $state) {

    $scope.page = 1;
    $scope.total = 0;
    $scope.search = {company : ""};

    $scope.limitInPage = config.application.limitInPage;

    $scope.search = function(term) {
        $scope.companyTable.reload();
    };

    $scope.refresh = function() {
        $scope.searchCompany = '';
    };

    $scope.companyTable = new ngTableParams({
        page: 1,            // show first page
        count: 5           // count per page
    }, {
        total: 0, // length of data
        getData: function ($defer, params) {
            var companies = Company.$search({page: params.page(), sort: params.orderBy(), keyword: $scope.search.company});
            var total = Company.count($scope.search.company);
            $q.all([companies.$asPromise(), total]).then(function (data) {
                $scope.total = data[1].data.total;
                params.total(data[1].data.total);
                $defer.resolve(data[0]);
            })
        }
    });
    $scope.viewCompany = function(company){
        $state.go('app.company-view',{id : company.Id});
    }
    $scope.editCompany = function(company){
        $state.go('app.company-update',{id : company.Id});
    }
    $rootScope.$on('company::deleted', function ($event) {
        $scope.companyTable.reload();
    });

    $scope.removeCompany = function (company) {
        dialogs.confirm('Remove a Company', 'Are you sure you want to remove a Company?').result.then(function(btn){
            company.$destroy().$asPromise().then(function (response) {
                $rootScope.$broadcast('company::deleted');
                toaster.pop('success', 'Company Deleted', 'You have successfully deleted a company.')
            });
        });
    };
}]);