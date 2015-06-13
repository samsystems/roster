'use strict';

angular.module('common').factory('User', ['$http', 'restmod', '$window', 'config', 'BasicAuth', 'AuthenticationService' , '$state', function ($http, restmod, $window, config, BasicAuth, AuthenticationService, $state) {

    return restmod.model('/user').mix('BaseModel', {

        notifications: { hasMany: 'Notification' },

        $extend: {
            Record: {
                getId: function () {
                    return this.Id;
                },
                getFirstName: function () {
                    return this.FirstName;
                },
                getLastName: function () {
                    return this.LastName;
                },
                getFullName: function () {
                    return (this.getFirstName() + " " + this.getLastName()).trim();
                },
                getCountryName: function () {
                    return this.Country;
                },
                getEmail: function () {
                    return this.Email;
                },
                getPhone1: function () {
                    return this.Phone1;
                },
                getWeb: function () {
                    return this.Web;
                },
                getFullGroups: function () {
                    var result = "";
                    for (var i = 0; i < this.Groups.length; i++) {
                        result += ((i != 0) ? ', ' : '') + this.Groups[i].Name;
                    }
                    return result;
                }
            },
            Model: {
                logIn: function (username, password) {
                    BasicAuth.setCredentials(username, password);

                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/user/login'
                    });
                },

                forgot: function (username) {
                    BasicAuth.setCredentials(username, 'password');

                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/user/reset-pass-by-email'
                    });
                },

                logOut: function () {
                    AuthenticationService.isLogged = false;
                    delete $window.sessionStorage.token;
                    delete $window.sessionStorage.tokenExpires;

                    $state.go("login");

                },

                userInSession: function () {
                    return this.$find(this.getCurrentUserId());
                },

                getCurrentUserId: function () {
                    return $window.sessionStorage.userId;
                },
                count: function (search) {
                    var keyword = (!_.isUndefined(search)) ? search : null;
                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/user/count',
                        params: { keyword: keyword }
                    });
                }

            }
        }
    });
}]);