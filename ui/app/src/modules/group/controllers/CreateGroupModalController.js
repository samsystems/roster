'use strict';

angular.module('group').controller('CreateGroupModalController', ['$scope', 'DateTimeService', 'toaster',
    function ($scope, DateTimeService, toaster) {
        $scope.modal.model.date = DateTimeService.nowIsoFormat();

        $scope.save = function() {
            $scope.modal.model[$scope.modal.save.call]($scope.modal.save.parameters, function(data) {
                var fn = $scope.modal.save.callback;
                if(_.isFunction(fn)) {
                    $scope.modal.save.callback(data);
                }
                $scope.$close();
            }, function(error) {
                toaster.pop('error', 'Error', error.data.detail);
            });
        };
    }]);