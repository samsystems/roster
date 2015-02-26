'use strict';

angular.module('common').factory('Industry', ['restmod', function(restmod){

    return restmod.model('/industry').mix({
        $config: { primaryKey: 'Iso' }
    });
}]);