'use strict';

angular.module('common').filter('outputFormatDateTime', ['DateTimeService', '$window', 'config', function(DateTimeService, $window, config) {
    return function(input, separator) {
        if(input == null) {
            return "";
        }

        separator = typeof separator == 'undefined' ? ' ' : separator;
        separator = separator.replace(/\n/g, "<br />");

        var offset  = parseInt(moment(input).format('ZZ')) * 36;
        var _timezone = (_.invert(config.timezone))[offset];
        var _date = moment.tz(input, _timezone);
        return DateTimeService.outputFormatDateTime(_date, separator);
    };
}]);