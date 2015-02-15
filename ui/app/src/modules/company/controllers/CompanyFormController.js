'use strict';

angular.module('company').controller('CompanyFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Company', 'Country', 'State',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, Company, Country, State) {

    $scope.countries = Country.$search();
    $scope.states    = State.$search();
    $scope.company = {};
    if(!_.isUndefined($stateParams.id)){
        $scope.company = Company.$find($stateParams.id);
    }
    //
    $scope.save = function() {
    //    $validation.validate($scope, 'company').success(function() {

            if(!_.isUndefined($scope.company.Id)){
                $scope.company.$save().$asPromise().then(function(response) {
                    $rootScope.$broadcast('company::updated');
                    toaster.pop('success', 'Company Updated ', 'You have been successfully updated a company.')
                    $scope.$goTo($scope.step.list);
                }, function() {
                    toaster.pop('error', 'Error', 'Something went wrong a new Company could not be created');
                });
            } else {
                var company =  Company.$build();
                company.Name = $scope.company.Name;
                company.Category = $scope.company.Category;
                company.Phone = $scope.company.Phone;
                company.Mobile = $scope.company.Mobile;
                company.Fax = $scope.company.Fax;
                company.Email = $scope.company.Email;
                company.Address1 = $scope.company.Address1;
                company.City = $scope.company.City;
                company.ZipCode = $scope.company.ZipCode;
                company.Tax = $scope.company.Tax;
                company.TaxId = $scope.company.TaxId;
                company.OrderNumber = $scope.company.OrderNumber;
                company.State = $scope.company.State;
                company.Country = $scope.company.Country;
                company.Notes = $scope.company.Notes;
                company.Organization = {Id: config.application.organizationId}
                company.$save().$asPromise().then(function(response) {
                    $rootScope.$broadcast('company::created');
                    toaster.pop('success', 'Company Created', 'You have successfully created a new company.');
                    $scope.$goTo($scope.step.list);
                }, function() {
                    toaster.pop('error', 'Error', 'Something went wrong a new Company could not be created');
                });
            }
        //}).error(function() {
        //    toaster.pop('error', 'Error', 'Complete the required entry fields.');
        //});
    };
}]);