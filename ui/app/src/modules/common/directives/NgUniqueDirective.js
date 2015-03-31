'use strict';

angular.module("common").directive("ngUnique", function (CommonService, $validation) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind('blur', function (e) {
                if (!ngModel || !element.val()) {
                    ngModel.$setValidity('uniqueValue', false);
                    return;
                }
                var keyProperty = scope.$eval(attrs.ngUnique);
                var currentValue = element.val();

                CommonService.checkUniqueValue(keyProperty.key, keyProperty.property, currentValue, keyProperty.id)
                    .then(function (unique) {
                        //Ensure value that being checked hasn't changed
                        //since the Ajax call was made
                        if (currentValue == element.val()) {
                            if (unique.data) {
                                var messageElem = element.closest('.form-group');
                                messageElem.removeClass('has-error');
                                if ($validation.showErrorMessage && messageToShow) {
                                    scope.setMessage(ngModel.validationId, null);
                                }
                            } else {
                                var messageElem = element.closest('.form-group'),
                                    messageToShow = "Is already taken.";
                                messageElem.addClass('has-error');
                                if ($validation.showErrorMessage && messageToShow) {
                                    scope.setMessage(ngModel.validationId, messageToShow);
                                }
                            }
                        }
                    });
            });
        }
    }
});