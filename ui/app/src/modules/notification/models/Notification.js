'use strict';

angular.module('notification').factory('Notification', ['restmod','config','$http', function(restmod, config, $http) {

    return restmod.model('/notification').mix({

        creator: { hasOne: 'User', map: 'Creator'},

        $extend: {
            Record: {
                getId: function() {
                    return this.Id;
                },
                getCategory: function() {
                    return this.Category;
                },
                getTitle: function() {
                    return this.Title;
                },
                getCreated: function() {
                    return this.Created;
                },
                isRead: function() {
                    return this.Read;
                }
            },
            Collection: {
                count: function () {
                    return this.length;
                }
            },
            Model: {
                count: function(search) {
                    var keyword = (!_.isUndefined(search)) ? search :null;
                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/notification/count',
                        params: { keyword: keyword }
                    });
                }
            }
        }
    });
}]);