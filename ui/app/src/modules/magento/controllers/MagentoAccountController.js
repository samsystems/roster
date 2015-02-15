'use strict';

angular.module('magento').controller('MagentoAccountController', ['$scope', 'MagentoAccount', 'WizardHandler', function ($scope, MagentoAccount, WizardHandler) {

    $scope.accounts = MagentoAccount.$search();

    $scope.step = {
        list:          'list',
        form:          'form'
    };

    $scope.user = {};

    $scope.$goTo = function(step) {
        WizardHandler.wizard().goTo(step);
    };

    $scope.createAccount = function() {
        $scope.account = {
            username: '',
            password: '',
            host: ''
        };
        $scope.$goTo($scope.step.form);
    };

    $scope.getList = function() {
        $scope.$goTo($scope.step.list);
    };

    $scope.selectAccount = function(account) {
        $scope.user = MagentoAccount.$find(account.id);
        $scope.$goTo($scope.step.form);
    };

    $scope.$close = function() {
        $scope.$goTo($scope.step.list);
    };
}]);