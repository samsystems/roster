'use strict';

angular.module('sale').factory('receivePayment', ['restmod', 'config','$http', function (restmod, config, $http) {

    return restmod.model('/receivePayment').mix('BaseModel', {
        $config: { primaryKey: 'Id' },
        itemProducts: { hasMany: 'InvoiceProduct'},
        $extend: {
            Record: {
                getId: function() {
                    return this.Id;
                }
            },
            Collection: {
                count: function () {
                    return this.length;
                },
                getTotal: function() {
                    var total = 0;
                    for (var i = 0; i < this.length; i++) {
                        total += this[i].Amount;
                    }
                    return total;
                }
            },
            Model: {
                maxOrderNumber: function() {
                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/invoice/max-ordernumber'
                    });
                },
                getResume: function(status) {
                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/invoice/resume/'+status
                    });
                },
                count: function(status,search) {
                    var keyword = (!_.isUndefined(search)) ? search :null;
                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/invoice/count',
                        params: { status:status,keyword: keyword }
                    });
                },
                items: function(idInvoice) {
                    return $http({
                        method: 'GET',
                        url: config.api.baseUrl + '/invoice/'+idInvoice+'/products'
                    });
                },
                pdf: function(html,base64) {
                    return $http({
                        method: 'POST',
                        url: config.api.pdfUrl,
                        data: { html:html,encodeBase64:base64 }
                    });
                }
            }
         }
    });

}]);