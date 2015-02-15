'use strict';

angular.module('common').filter('currency', function() {
    return function(number, currencyCode) {
        var currency = {
                USD: "$",
                GBP: "£",
                AUD: "$",
                EUR: "€",
                CAD: "$",
                MIXED: "~"
            },
            thousand, decimal, format;

        if(_.isUndefined(currencyCode)) {
            currencyCode = 'USD';
        }

        if ($.inArray(currencyCode, ["USD", "AUD", "CAD", "MIXED"]) >= 0) {
            thousand = ",";
            decimal = ".";
            format = "%s%v";
        } else if($.inArray(currencyCode, ["EUR"]) >= 0) {
            thousand = ".";
            decimal = ",";
            format = "%v%s";
        }
        else {
            thousand = ".";
            decimal = ",";
            format = "%s%v";
        }

        return accounting.formatMoney(number, currency[currencyCode], 2, thousand, decimal, format);
    };
});