'use strict';

angular.module('user').directive('passwdCheck', ['$rootScope',
    function($rootScope) {
        return {
            restrict: 'A',
            scope: true,
            require: 'ngModel',
            link: function($scope,elem, attr,control) {
                var checker = function () {
	                var password1 = $scope.$eval(attr.ngModel);
	                var password2 = $scope.$eval(attr.passwordMatch);
                	 if(password1 != password2) {
                	 	  	control.$setValidity("unique", n);
                	 	  }else {
                	 	  	return;
                	 	  }


            	};


       		}
        }
}]);

