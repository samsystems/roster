'use strict';

angular.module('common').provider('$print', function() {

    var $interpolate    = null,
        $injector       = null,
        $window         = null,
        $http           = null,
        toaster         = null,
        $rootScope      = null;

    this.setupProviders = function(injector) {
        $injector   = injector;
        $interpolate= $injector.get('$interpolate');
        $http       = $injector.get('$http');
        toaster     = $injector.get('toaster');
        $window     = $injector.get('$window');
        $rootScope  = $injector.get('$rootScope');
    };

    this.printHtml = function(content) {

        $http({
            method: 'GET',
            url: '/src/modules/common/views/print.html',
            type: 'text'
        }).success(function(html) {
            var interpolatedHtml = $interpolate(html)({content: content});

            var popupWin = $window.open('', '_blank', 'width=700,height=700');
            popupWin.document.open();
            popupWin.document.write(interpolatedHtml);
            popupWin.document.close();
        }).error(function() {
            toaster.pop('error', 'No print template found', 'Can\'t find print template. Printing cannot continue.');
        });


    };

    this.$get = function($injector) {
        this.setupProviders($injector);

        return {
            html: this.printHtml
        };
    };
    this.$get.$inject = ['$injector'];

});