'use strict';

angular.module('magento').controller('MagentoAccountListController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'MagentoAccount', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, MagentoAccount) {

    $scope.accounts = MagentoAccount.$search({page : $scope.page});

    $rootScope.$on('magentoAccount::created', function(event, account) {
        if(!_.isEmpty(account)) {
            $scope.accounts.push(account);
        }
    });

    $rootScope.$on('magentoAccount::updated', function(event, account) {
        if(!_.isEmpty(account)) {
            for(var i=0; i < $scope.accounts.length; i++) {
                if($scope.accounts[i].id == user.id) {
                    $scope.accounts[i] = user;
                    break;
                }
            }
        }
    });

    $rootScope.$on('magentoAccount::deleted', function($event, account) {
        if(!_.isEmpty(account)) {
            for(var i=0; i<$scope.accounts.length; i++) {
                if($scope.accounts[i].id == account.id) {
                    $scope.accounts.splice(i, 1);
                }
            }
        }
    });

    $scope.removeAccount = function(account) {
        dialogs.confirm('Remove an Account', 'If you decide to delete this account, all the data related to it will be automatically deleted!' +
                '<br/> Are you sure you want to remove this account?').result.then(function(btn){
            account.$delete({id: account.id}, function (response) {
                $rootScope.$broadcast('magentoAccount::deleted', response);
                toaster.pop('success', 'Account Deleted', 'You have successfully deleted an account.')
            });
        });
    };
}]);