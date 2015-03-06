'use strict';

angular.module('common').factory('Location', ['restmod', function(restmod){

    return restmod.model('/location').mix({
        $config: { primaryKey: 'Id' }
    });

}]);