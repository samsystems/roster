'use strict';

angular.module('common').directive('rosFieldSet', [function(){


    return {
        require: '^rosForm',
        restrict: 'E',
        templateUrl: 'src/modules/common/views/field-set-directive.html',
        transclude: true,
        replace: true,
        scope: {
            title: '@title'
        },
        controller: function($scope) {
            var ctrl = this,
                fields = ctrl.fields = $scope.fields = [];

            ctrl.addField = function addField(field) {
                fields.push(field);
            };

            ctrl.removeField = function removeField(field) {
                var index = fields.indexOf(field);
                fields.splice(index, 1);
            };

            var destroyed;
            $scope.$on('$destroy', function() {
                destroyed = true;
            });
        }
    };
}])

.directive('fieldContentTransclude', function() {
    return {
        restrict: 'A',
        require: '^fieldSet',
        link: function(scope, elm, attrs) {
            var field = scope.$eval(attrs.fieldContentTransclude);

            //Now our field is ready to be transcluded: both the field heading area
            //and the field content area are loaded.  Transclude 'em both.
            field.$transcludeFn(field.$parent, function(contents) {
                angular.forEach(contents, function(node) {
                    elm.append(node);
                });
            });
        }
    };
});
