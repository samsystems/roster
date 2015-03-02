'use strict';

angular.module('common').directive('rosForm', [function(){


    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/form-directive.html',
        transclude: true,
        replace: true,
        link: function($scope, elem, attrs) {
            elem.addClass('form-horizontal group-border stripped');
        }
    };
}]);
