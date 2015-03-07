'use strict';

angular.module('common').directive('rosField', [function(){

    return {
        require: '^rosFieldSet',
        restrict: 'E',
        templateUrl: 'src/modules/common/views/field-directive.html',
        replace: false,
        scope: {
            size:  '@size',
            title: '@title',
            type:  '@type',
            name:  '@name',
            model: '=ngModel'
        },
        link: function(scope, element, attrs) {
            
        }
    };

}]);
