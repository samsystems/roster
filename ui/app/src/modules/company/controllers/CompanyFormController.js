'use strict';

angular.module('company').controller('CompanyFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Company', 'Country', 'State','$state',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, Company, Country, State, $state) {

    $scope.countries = Country.$search();
    $scope.states    = State.$search();
    $scope.company = {};
    if(!_.isUndefined($stateParams.id)){
        $scope.company = Company.$find($stateParams.id);
    }else{
        $scope.company =  Company.$build();
        $scope.company.Organization = {Id: config.application.organizationId}
    }
    //
    $scope.save = function() {
    //    $validation.validate($scope, 'company').success(function() {

            if(!_.isUndefined($scope.company.Id)){
                $scope.company.$save().$then(function(response) {
                    $rootScope.$broadcast('company::updated');
                    toaster.pop('success', 'Company Updated ', 'You have been successfully updated a company.')
                    $state.go("app.company");
                }, function() {
                    toaster.pop('error', 'Error', 'Something went wrong a new Company could not be created');
                });
            } else {
                $scope.company.$save().$then(function(response) {
                    $rootScope.$broadcast('company::created');
                    toaster.pop('success', 'Company Created', 'You have successfully created a new company.');
                    $state.go("app.company");
                }, function() {
                    toaster.pop('error', 'Error', 'Something went wrong a new Company could not be created');
                });
            }
        //}).error(function() {
        //    toaster.pop('error', 'Error', 'Complete the required entry fields.');
        //});
    };
}]);