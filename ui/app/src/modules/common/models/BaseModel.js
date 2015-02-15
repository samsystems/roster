'use strict';

angular.module('common').factory('BaseModel', ['restmod', function (restmod) {

    return restmod.model('/').mix({
        $extend: {
            Record: {
                getId: function() {
                    return this.Id;
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