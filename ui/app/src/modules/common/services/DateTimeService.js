'use strict';

angular.module('common').factory('DateTimeService', ['config', '$window', function(config, $window) {
    return {
        now: function() {
            return moment().tz($window.sessionStorage.timezone);
        },
        nextDays: function(numberDays) {
            var date = moment().add(numberDays, 'days').tz($window.sessionStorage.timezone);
            return date.format(config.date.isoFormat);
        },
        outputFormatDateTime: function(date, separator) {
            separator = typeof separator == 'undefined' ? ' ' : separator;

            var format = config.date.outputFormatDateTime.replace("[separator]", separator);
            return date.format(format);
        },
        outputFormatDate: function(date) {
            return date.format(config.date.outputFormatDate);
        },
        inputFormatDate: function(date) {
            return date.format(config.date.inputFormatDate);
        },
        inputFormatDateTime: function(date) {
            return date.format(config.date.inputFormatDateTime);
        },
        isoFormat: function(date) {
            return date.format(config.date.isoFormat);
        },
        nowIsoFormat: function() {
            var date = moment().tz($window.sessionStorage.timezone);
            return date.format(config.date.isoFormat);
        }
    }
}]);