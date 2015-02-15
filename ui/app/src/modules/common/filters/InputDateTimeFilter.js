'use strict';

angular.module('common').filter('inputFormatDateTime', ['DateTimeService', '$window', 'config', function(DateTimeService, $window, config) {
    return function(input) {
        if(input == null) {
            return "";
        }

        var offset  = parseInt(moment(input).format('ZZ')) * 36;
        var _timezone = (_.invert(config.timezone))[offset];
        var _date = moment.tz(input, _timezone);
        return DateTimeService.inputFormatDateTime(_date);
    };
}]);