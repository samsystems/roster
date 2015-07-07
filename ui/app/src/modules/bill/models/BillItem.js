'use strict';

angular.module('bill').factory('BillItem', ['restmod', 'config','$http', function (restmod, config, $http) {

    return restmod.model('/billItem').mix('BaseModel', {
        $extend: {
         }
    });

}]);