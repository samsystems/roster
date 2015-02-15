'use strict';

angular.module('magento').factory('MagentoAccount', ['restmod', function(restmod) {

    return restmod.model('/magento/account').mix('BaseModel');

}]);