'use strict';

angular.module('common').filter('startFrom', function() {
    return function(input, start) {
        return input.slice(start);
    }
});