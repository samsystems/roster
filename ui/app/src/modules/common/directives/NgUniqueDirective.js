'use strict';

angular.module("common").directive("ngUnique", function(CommonService,$validation) {
    	  return {
        	    restrict: 'A',
        	    require: 'ngModel',
        	    link: function (scope, element, attrs, ngModel) {
                    element.bind('blur', function (e) {
            	        if (!ngModel || !element.val()){ngModel.$setValidity('unique', false); return};
            	        var keyProperty = scope.$eval(attrs.ngUnique);
            	        var currentValue = element.val();
                        var messageElem = element.closest('.form-group'),
                            messageToShow = "Este elemento no es unico";
                        messageElem.addClass('has-error');

                        if ($validation.showErrorMessage && messageToShow) {
                            scope.setMessage(ngModel.validationId, messageToShow);
                        }
                        if(currentValue==='')
                           ngModel.$setValidity('unique', false);
                        else
                            ngModel.$setValidity('unique', true);
                        console.log('ok');
                     /* CommonService.checkUniqueValue(keyProperty.key, keyProperty.property, currentValue)
            	          .then(function (unique) {
                	            //Ensure value that being checked hasn't changed
                	            //since the Ajax call was made
                	            if (currentValue == element.val()) {
                    	              console.log('unique = '+unique.data.isUnique);
                    	              ngModel.$setValidity('unique', unique.data.isUnique);
                    	              scope.$broadcast('show-errors-check-validity');
                    	            }
                	          });*/
            	      });
        	    }
    	  }
	});