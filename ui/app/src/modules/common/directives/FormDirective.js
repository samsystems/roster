'use strict';

angular.module('common').directive('form', [function(){


    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/form-directive.html',
        transclude: true,
        link: function($scope, elem, attrs) {
            elem.addClass('form-horizontal group-border stripped');
        }
    };
}]);
