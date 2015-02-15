'use strict';

angular.module('user').controller('UserController', ['User','Group', 'PermissionService', 'Country', 'Company', '$scope', 'DateTimeService', 'config', '$modal', '$rootScope', 'dialogs', 'toaster', '$validation', 'WizardHandler',function (User, Group, PermissionService, Country, Company, $scope,  DateTimeService, config , $modal , $rootScope, dialogs, toaster, $validation, WizardHandler) {

    $scope.countries         = Country.$search();
    $scope.companies         = Company.$search({page: 0, order:'name'});
    $scope.groups            = Group.$search();

    $scope.step = {
        list:          'list',
        form:          'form'
    };
    $scope.user = {};

    $scope.$goTo = function(step) {
        WizardHandler.wizard().goTo(step);
    };

    $scope.createUser = function() {
        $scope.user = {
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            dob: null,
            address: {}
        };
        $scope.$goTo($scope.step.form);
    };

    $scope.getList = function() {
        $scope.$goTo($scope.step.list);
    };

    $scope.selectUser = function(user) {
        $scope.user = userResource.get({id: user.id});
        $scope.$goTo($scope.step.form);
    };

    $scope.$close = function() {
        $scope.$goTo($scope.step.list);
    };
}]);