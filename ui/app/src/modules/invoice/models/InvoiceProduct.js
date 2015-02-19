'use strict';

angular.module('invoice').factory('InvoiceProduct', ['restmod', 'config','$http', function (restmod, config, $http) {

    return restmod.model('/invoiceProduct').mix('BaseModel', {
        $extend: {
         }
    });

}]);