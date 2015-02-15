'use strict';

angular.module('vendor').factory('Vendor', ['restmod', '$window', 'config','$http', function(restmod, $window, config, $http) {
  return restmod.model('/vendor').mix({
    $config: { primaryKey: 'Id' },
    $extend: {
      Model: {
        count: function(search) {
          var keyword = (!_.isUndefined(search)) ? search :null;
          return $http({
            method: 'GET',
            url: config.api.baseUrl + '/vendor/count',
            params: { keyword: keyword }
          });
        }
      }
    }
  });

}]);
