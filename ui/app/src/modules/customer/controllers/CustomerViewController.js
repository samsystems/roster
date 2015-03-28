'use strict';

angular.module('customer').controller('CustomerViewController', ['$scope', '$rootScope', 'dialogs', '$state', 'toaster', '$stateParams', 'config', 'Customer','Country','State',
    function ($scope, $rootScope, dialogs, $state, toaster, $stateParams, config, Customer, Country, State) {

    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
    $scope.customer = {};

    if(id != null){
        $scope.customer = Customer.$find(id).$then(function(){
            $scope.customer.contacts.$fetch();
        });
    }


    $scope.removeCustomer = function(customer) {
        dialogs.confirm('Remove a Customer', 'Are you sure you want to remove a Customer?').result.then(function(btn){
            customer.$destroy().$asPromise().then(function (response) {
                $rootScope.$broadcast('customer::deleted');
                toaster.pop('success', 'Customer Deleted', 'You have successfully deleted a customer.')
            });
            $state.go("app.customer");
        });
    };

}]);