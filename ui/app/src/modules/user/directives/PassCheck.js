'use strict';

angular.module('user').directive('passwdCheck', ['$rootScope',
    function($rootScope) {
        return {
            restrict: 'A',
            scope: true,
            require: 'ngModel',
            link: function($scope,elem, attr,control) {
                console.log("asas1111");
                var checker = function () {
                    console.log("asas11111222222222222");
	                var password1 = $scope.$eval(attr.ngModel); 
	                var password2 = $scope.$eval(attr.passwordMatch);
                	 console.log('asa');
                	 if(password1 != password2) {
                	 	  	control.$setValidity("unique", n);
                	 	  }else {
                	 	  	return;
                	 	  }


            	};


       		}
        }
}]);

