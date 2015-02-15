angular.module('common').directive('handOver', ['$modal', '$http', function($modal, $http){
    return {
        restrict: 'E',
        scope: {
            encounterId: '@'
        },
        template: '<button class="btn btn-default" data-ng-click="showHandOverModal()">Hand-Over</button>&nbsp;' + "{{creator || '?'}} - {{assignedTo || '?'}}",
        link: function($scope, elem, attrs) {

            $http({
                method: 'POST',
                url: '/patient/hand-over-async/get-info',
                data: $.param({
                    encounterId: $scope.encounterId
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(info){
                $scope.groups       = info.groups;
                $scope.creator      = info.creator;
                $scope.assignedTo   = info.assignedTo;
            });

            $scope.showHandOverModal = function() {
                $modal.open({
                    templateUrl: '/patient/hand-over/form',
                    controller: HandOverModalController,
                    size: '',
                    resolve: {
                        groups: function(){
                            return $scope.groups;
                        }
                    }
                });
            };

            var HandOverModalController = function($scope, $modalInstance, groups) {

                $scope.groups = groups;

                $scope.handOver = function() {

                    $http({
                        method: 'POST',
                        url: '/patient/hand-over-async/save',
                        data: $.param({
                            signature: this.signature,
                            user: this.username,
                            password: this.password,
                            group: this.group.id
                        }),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(function(response){
                        if(!_.isUndefined(response.errors)) {
                            var errors = '';
                            _.each(response.errors, function(error){
                                errors += '\n' + error;
                            });

                            error(errors);
                        }
                        else {
                            $modalInstance.close();
                        }
                    });
                };

            };
        }
    };
}]);