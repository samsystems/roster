'use strict';

angular.module('common').directive('rosField', [function(){


    return {
        require: '^rosFieldSet',
        restrict: 'E',
        templateUrl: 'src/modules/common/views/field-directive.html',
        transclude: true,
        replace: true,
        scope: {
            size:  '@size',
            title: '@title',
            type:  '@type'
        },
        controller: function() {
            //Empty controller so other directives can require being 'under' a field
        },
        compile: function(elm, attrs, transclude) {
            return function postLink(scope, elm, attrs, fieldSetCtrl) {
                fieldSetCtrl.addField(scope);

                scope.$on('$destroy', function() {
                    fieldSetCtrl.removeField(scope);
                });

                //We need to transclude later, once the content container is ready.
                //when this link happens, we're inside a tab heading.
                scope.$transcludeFn = transclude;
            };
        }
    };

}]);
