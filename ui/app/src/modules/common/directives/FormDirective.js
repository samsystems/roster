'use strict';

angular.module('common').directive('rosForm', [function(){


    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/form-directive.html',
        transclude: true,
        replace: true
    };
}]);
