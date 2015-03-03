'use strict';

angular.module('company').factory('CompanyScope', ['restmod', function(restmod){

    return restmod.model('/company/scope').mix({
        $config: { primaryKey: 'Iso' }
    });
}]);