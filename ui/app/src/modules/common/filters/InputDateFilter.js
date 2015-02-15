'use strict';

angular.module('common').filter('inputFormatDate', ['DateTimeService', function(DateTimeService) {
    return function(input) {
        if(input == null) {
            return "";
        }

        var _date = moment(input);
        return DateTimeService.inputFormatDate(_date);

    };
}]);