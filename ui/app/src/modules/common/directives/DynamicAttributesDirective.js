'use strict';

angular.module('common').directive('dynamicAttributes', function() {
    return {
        restrict: 'A',
        scope: {
            list: '=dynamicAttributes'
        },
        link: function(scope, elem, attrs){
            for(var attr in scope.list){
                elem.attr(scope.list[attr].attr, scope.list[attr].value);
            }
        }
    };
});