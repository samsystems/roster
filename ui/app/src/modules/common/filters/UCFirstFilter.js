'use strict';

angular.module('common').filter('ucfirst', function() {
    return function(input) {
        return input.substring(0,1).toUpperCase()+input.substring(1);
    }
});