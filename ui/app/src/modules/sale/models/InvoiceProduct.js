'use strict';

angular.module('sale').factory('InvoiceProduct', ['restmod', 'config','$http', function (restmod, config, $http) {

    return restmod.model('/invoiceProduct').mix('BaseModel', {
        $extend: {
         }
    });

}]);