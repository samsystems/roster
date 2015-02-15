'use strict';

angular.module('group').factory('Group', ['restmod', function(restmod) {

    return restmod.model('/group').mix('BaseModel');

}]);