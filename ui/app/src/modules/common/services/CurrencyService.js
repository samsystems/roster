/**
 * Created by rolian85 on 1/20/15.
 */
'use strict';

angular.module('common').factory('CurrencyService', ['config', function(config) {
    return {
        current: function() {
            return config.application.currency;
        }
    }
}]);
