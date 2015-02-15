'use strict';

angular.module('notification').factory('NotificationService', ['restmod', function(restmod) {

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
            }
        }
    });
}]);