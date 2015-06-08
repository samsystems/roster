/**
 * Created by rolian85 on 1/20/15.
 */
'use strict';

angular.module('common').service('ExportCSVService', ['toaster', '$http', 'config', function(toaster, $http, config) {
    return {
        export : function(model){
            $http({
                method: 'GET',
                url: config.api.baseUrl + "/export-csv/" + model
            }).success(function(response) {
                $('#link-download-element').remove();
                var href = "data:application/octet-stream;base64," + response;
                $('<a id="link-download-element" href="' + href +'" download="' + model + '.csv" style="display: none">').appendTo($('body'))[0].click();
            });
        }
    }
}]);
