'use strict';

angular.module('common').directive('panel', [function(){

    var panelTypes = ['default', 'success', 'info', 'danger', 'warning'];

    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/panel-directive.html',
        transclude: true,
        scope: {
            title: '@title',
            iconClass: '@iconClass',
            type: '@type'
        },
        link: function($scope, element, attr) {
            $scope.panel = {
                title: $scope.title,
                iconClass: $scope.iconClass,
                isPlain: false
            };

            if(!_.isUndefined($scope.type) && panelTypes.indexOf($scope.type) > -1) {
                $scope.panel.type = "panel-" + $scope.type;
            }
            else {
                $scope.panel.type = 'panel-default';
            }

            if(!_.isUndefined($scope.type) && $scope.type == "plain") {
                $scope.panel.isPlain = true;
            }
        }
    };
}]);
