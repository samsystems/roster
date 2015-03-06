'use strict';

angular.module('common').factory('Account', ['restmod', function(restmod){

    return restmod.model('/account').mix({
        $config: { primaryKey: 'Id' }
    });

}]);