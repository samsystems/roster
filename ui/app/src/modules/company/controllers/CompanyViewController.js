'use strict';

angular.module('company').controller('CompanyViewController', ['$scope', '$rootScope', 'dialogs', '$state', 'toaster', '$stateParams', 'config', 'Company','Country','State',
    function ($scope, $rootScope, dialogs, $state, toaster, $stateParams, config, Company, Country, State) {

    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
    $scope.company = {};

    if(id != null){
        $scope.company = Company.$find(id).$then(function(){
            $scope.company.Country = Country.$find($scope.company.Country.Iso);
            $scope.company.State = State.$find($scope.company.State.Id);
        });
    }


    $scope.removeCompany = function(company) {
        dialogs.confirm('Remove a Company', 'Are you sure you want to remove a Company?').result.then(function(btn){
            company.$destroy().$asPromise().then(function (response) {
                $rootScope.$broadcast('company::deleted');
                toaster.pop('success', 'Company Deleted', 'You have successfully deleted a company.')
            });
        });
        $state.go("app.company");
    };

}]);