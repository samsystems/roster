'use strict';

angular.module("common").directive("ngUnique", function(CommunService) {
    	  return {
        	    restrict: 'A',
        	    require: 'ngModel',
        	    link: function (scope, element, attrs, ngModel) {
                    element.bind('blur', function (e) {
            	        if (!ngModel || !element.val()) return;
            	        var keyProperty = scope.$eval(attrs.ngUnique);
            	        var currentValue = element.val();
                      CommunService.checkUniqueValue(keyProperty.key, keyProperty.property, currentValue)
            	          .then(function (unique) {
                	            //Ensure value that being checked hasn't changed
                	            //since the Ajax call was made
                	            if (currentValue == element.val()) {
                    	              console.log('unique = '+unique.data.isUnique);
                    	              ngModel.$setValidity('unique', unique.data.isUnique);
                    	              scope.$broadcast('show-errors-check-validity');
                    	            }
                	          });
            	      });
        	    }
    	  }
	});