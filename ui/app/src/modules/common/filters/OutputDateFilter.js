'use strict';

angular.module('common').filter('outputFormatDate', ['DateTimeService', function(DateTimeService) {
    return function(input) {
        if(input == null) {
            return "";
        }

        var _date = moment(input);
        return DateTimeService.outputFormatDate(_date);

    };
}]);