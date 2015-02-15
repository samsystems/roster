'use strict';

angular.module('common').factory('State', ['restmod', function(restmod){

    return restmod.model('/state').mix({
        $config: { primaryKey: 'Id' }
    });

}]);