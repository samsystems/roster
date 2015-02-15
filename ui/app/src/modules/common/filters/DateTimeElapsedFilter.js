'use strict';

angular.module('common').filter('timeElapsed', ['DateTimeService', function(DateTimeService) {
    return function(input, format) {
        if(input == null) {
            return "";
        }

        var now  = DateTimeService.now();
        var then = moment.parseZone(input);

        var ms = now.diff(then);
        var d  = moment.duration(ms);
        var calendar ='';
        if(format == "hours"){
            if (Math.floor(d.asMinutes()) < 60){
                calendar = 'min(s)';
                return Math.floor(d.asMinutes()) + ' ' + calendar;

            }else{
                calendar = 'hour(s)';
                return Math.floor(d.asHours()) + ' ' + calendar;
            }
        } else {
            return d.humanize();
        }
    };
}]);