'use strict';

angular.module('common').factory('LanguageAsyncLoaderService', ['$http', function ($http) {

    return function (options) {
        return $http({
            method: 'GET',
            url: 'src/i18n/' + options.key + '.json'
        });
    };

}]);