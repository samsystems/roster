'use strict';

angular.module('common').directive('rosFieldSet', [function(){


    return {
        require: '^rosForm',
        restrict: 'E',
        templateUrl: 'src/modules/common/views/field-set-directive.html',
        transclude: true,
        replace: true,
        controller: function() {
            //Empty controller so other directives can require being 'under' a fieldset
        }
    };
}]);
