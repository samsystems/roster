'use strict';

angular.module('magento').controller('MagentoAccountFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'MagentoAccount', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, MagentoAccount) {

    $scope.save = function() {
        $validation.validate($scope, 'account').success(function() {

            if(!_.isUndefined($scope.account.id)){
                $scope.account.$update({id: $scope.account.id}, function(response) {
                    $rootScope.$broadcast('magentoAccount::updated', response);
                    toaster.pop('success', 'Updated a magento account', 'You Have Successfully Updated a magento account.')
                });
            }else{

                var magentoAccount  = new magentoAccountResource();
                magentoAccount.username   = $scope.account.username;
                magentoAccount.host       = $scope.account.host;
                magentoAccount.password   = $scope.account.password;

                magentoAccount.$save({}, function(response) {
                    $rootScope.$broadcast('magentoAccount::created', response);
                    toaster.pop('success', 'Created a Magento Account', 'You have successfully created a new magento account.');
                }, function() {
                    toaster.pop('error', 'Error', 'Something went wrong a new magento account could not be created');
                });
            }
            $scope.$goTo($scope.step.list);
        }).error(function() {
            toaster.pop('error', 'Error', 'Complete the required entry fields.');
        });

    }; // end of ok function
}]);