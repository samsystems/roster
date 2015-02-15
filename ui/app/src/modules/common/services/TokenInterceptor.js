'use strict';

angular.module('common').factory('TokenInterceptor', ['$q', '$window', 'toaster', function ($q, $window, toaster) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers['access_token'] = $window.sessionStorage.token;
            }
            return config;
        },

        response: function (response) {
            return response || $q.when(response);
        },

        'responseError': function(rejection) {
            // If token expired, or token required
            if((rejection.status == 498 || rejection.status == 499) && $window.location.hash != '#/login') {
                toaster.pop('error', 'Token expired', 'Your session has expired.');
                $window.location = '#/login';
            }

            return $q.reject(rejection);
        }
    };
}]);