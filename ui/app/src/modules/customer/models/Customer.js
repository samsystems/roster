'use strict';

angular.module('customer').factory('Customer', ['restmod', function(restmod) {

    return restmod.model('/customer').mix('BaseModel');
}]);