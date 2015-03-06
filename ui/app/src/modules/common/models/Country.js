'use strict';

angular.module('common').factory('Country', ['restmod', function(restmod){
    return restmod.model('/country').mix({
        $config: { primaryKey: 'Iso' }
    });
}]);