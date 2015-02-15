'use strict';

angular.module('product').factory('Note', ['restmod', function(restmod) {

    return restmod.model('/note').mix('BaseModel');
}]);