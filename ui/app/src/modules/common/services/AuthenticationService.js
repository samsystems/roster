'use strict';

angular.module('common').factory('AuthenticationService', function() {

    var auth = {
        isLogged: false
    };

    return auth;
});