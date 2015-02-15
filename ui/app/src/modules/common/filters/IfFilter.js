'use strict';

angular.module('common').filter('if', [function() {
    return function(input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
    };
}]);