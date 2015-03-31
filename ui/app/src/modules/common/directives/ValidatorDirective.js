'use strict';

angular.module('common').directive('validator', ['$validation', '$q', '$timeout', '$rootScope', '$compile', 'uuid', '$injector',
    function($validation, $q, $timeout, $rootScope, $compile, uuid, $injector) {

        var tooltipTemplate = '<span class="validation" tooltip="{{validation.tooltip}}" tooltip-placement="bottom" tooltip-trigger="show-validation"></span>';

        /**
         * Do this function if validation valid
         * @param scope
         * @param element
         * @param validMessage
         * @param validation
         * @param ctrl
         * @returns {}
         */
        var validFunc = function(scope, element, validMessage, validation, ctrl) {
            var messageElem = element.closest('.form-group'),
                messageToShow = validMessage || $validation.getDefaultMsg(validation).success;

            messageElem.removeClass('has-error');

            if ($validation.showSuccessMessage && messageToShow) {
                scope.setMessage(ctrl.validationId, '');
            }
            ctrl.$setValidity(ctrl.$name, true);

            return true;
        };


        /**
         * Do this function if validation invalid
         * @param scope
         * @param element
         * @param validMessage
         * @param validation
         * @param ctrl
         * @returns {}
         */
        var invalidFunc = function(scope, element, validMessage, validation, ctrl) {
            var messageElem = element.closest('.form-group'),
                messageToShow = validMessage || $validation.getDefaultMsg(validation).error;

            messageElem.addClass('has-error');

            if ($validation.showErrorMessage && messageToShow) {
                scope.setMessage(ctrl.validationId, messageToShow);
            }
            ctrl.$setValidity(ctrl.$name, false);

            return false;
        };


        /**
         * If var is true, focus element when validate end
         * @type {boolean}
         ***private variable
         */
        var isFocusElement = false;


        /**
         * Check Validation with Function or RegExp
         * @param scope
         * @param element
         * @param attrs
         * @param ctrl
         * @param validation
         * @param value
         * @returns {}
         */
        var checkValidation = function(scope, element, attrs, ctrl, validation, value) {

            var validators = validation.slice(0),
                validator = validators[0].trim(),
                leftValidation = validators.slice(1),
                successMessage = validator + 'SuccessMessage',
                errorMessage = validator + 'ErrorMessage',
                expression = $validation.getExpression(validator),
                valid = {
                    success: function() {
                        validFunc(scope, element, attrs[successMessage], validator, ctrl);
                        if (leftValidation.length) {
                            checkValidation(scope, element, attrs, ctrl, leftValidation, value);
                        } else {
                            return true;
                        }
                    },
                    error: function() {
                        return invalidFunc(scope, element, attrs[errorMessage], validator, ctrl);
                    }
                };

            if (expression === undefined) {
                console.error('You are using undefined validator "%s"', validator);
                if (leftValidation.length) {
                    checkValidation(scope, element, attrs, ctrl, leftValidation, value);
                } else {
                    return;
                }
            }
            // Check with Function
            if (expression.constructor === Function) {
                return $q.all([$validation.getExpression(validator)(value, scope, element, attrs, $injector)])
                    .then(function(data) {
                        if (data && data.length > 0 && data[0]) {
                            return valid.success();
                        } else {
                            return valid.error();
                        }
                    }, function() {
                        return valid.error();
                    });
            }
            // Check with RegExp
            else if (expression.constructor === RegExp) {
                return $validation.getExpression(validator).test(value) ? valid.success() : valid.error();
            } else {
                return valid.error();
            }
        };

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {

                if(_.isUndefined(scope.validation)) {
                    scope.validation = {
                        messages: [],
                        tooltip: 'Required'
                    };
                }

                var tooltip = $compile(angular.element(tooltipTemplate))(scope);
                element.after(tooltip);

                element.bind('mouseenter', function() {
                    var message = scope.validation.messages[element.attr('validationId')];

                    if(!_.isEmpty(message)) {
                        tooltip.triggerHandler('show-validation');

                        scope.$evalAsync(function() {
                            scope.validation.tooltip = message;
                        });
                    }
                });
                element.bind('mouseleave', function() {
                    tooltip.triggerHandler('hide-validation');
                });

                /**
                 * watch
                 * @type {watch}
                 *
                 * Use to collect scope.$watch method
                 *
                 * use watch() to destroy the $watch method
                 */
                var watch = function() {};

                /**
                 * validator
                 * @type {Array}
                 *
                 * Convert user input String to Array
                 */
                var validation = attrs.validator.split(',');

                /**
                 * guid use
                 */
                var uid = ctrl.validationId = uuid.v4();
                element.attr('validationId', uid);

                /**
                 * Reset the validation for specific form
                 */
                scope.$on(ctrl.$name + 'reset-' + uid, function() {

                    /**
                     * clear scope.$watch here
                     * when reset status
                     * clear the $watch method to prevent
                     * $watch again while reset the form
                     */
                    watch();

                    isFocusElement = false;
                    ctrl.$setViewValue('');
                    ctrl.$setPristine();
                    ctrl.$setValidity(ctrl.$name, undefined);
                    ctrl.$render();
                    scope.setMessage(ctrl.validationId, '');
                });

                scope.setMessage = function(id, message) {
                    scope.validation.messages[id] = message;
                };

                /**
                 * Check validator
                 */

                (function() {
                    /**
                     * Click submit form, check the validity when submit
                     */
                    scope.$on(ctrl.$name + 'submit-' + uid, function(event, index) {
                        var value = ctrl.$viewValue,
                            isValid = false;

                        if (index === 0) {
                            isFocusElement = false;
                        }

                        isValid = checkValidation(scope, element, attrs, ctrl, validation, value);

                        if (attrs.validMethod === 'submit') {
                            watch(); // clear previous scope.$watch
                            watch = scope.$watch(function() { return ctrl.$modelValue; }, function(value, oldValue) {

                                // don't watch when init
                                if (value === oldValue) {
                                    return;
                                }

                                // scope.$watch will translate '' to undefined
                                // undefined/null will pass the required submit /^.+/
                                // cause some error in this validation
                                if (value === undefined || value === null) {
                                    value = '';
                                }

                                isValid = checkValidation(scope, element, attrs, ctrl, validation, value);
                            });

                        }

                        // Focus first input element when submit error #11
                        if (!isFocusElement && !isValid) {
                            isFocusElement = true;
                            element[0].focus();
                        }
                    });

                    /**
                     * Validate blur method
                     */
                    if (attrs.validMethod === 'blur') {
                        element.bind('blur', function() {
                            var value = ctrl.$viewValue;
                            scope.$apply(function() {
                                checkValidation(scope, element, attrs, ctrl, validation, value);
                            });
                        });

                        return;
                    }

                    /**
                     * Validate submit & submit-only method
                     */
                    if (attrs.validMethod === 'submit' || attrs.validMethod === 'submit-only') {
                        return;
                    }

                    /**
                     * Validate watch method
                     * This is the default method
                     */
                    scope.$watch(function() { return ctrl.$modelValue; }, function(value) {

                        /**
                         * dirty, pristine, viewValue control here
                         */
                        if (ctrl.$pristine && ctrl.$viewValue) {
                            // has value when initial
                            ctrl.$setViewValue(ctrl.$viewValue);
                        } else if (ctrl.$pristine) {
                            // Don't validate form when the input is clean(pristine)
                            scope.setMessage(ctrl.validationId, '');
                            return;
                        }
                        checkValidation(scope, element, attrs, ctrl, validation, value);
                    });
                })();

            }
        };
    }
]);

angular.module('common').directive('validationSubmit', ['$validation', '$timeout', '$parse', function($validation, $timeout, $parse) {

        return {
            priority: 1, // execute before ng-click (0)
            require: '?ngClick',
            link: function postLink(scope, element, attrs) {
                var form = $parse(attrs.validationSubmit)(scope);

                $timeout(function() {
                    // Disable ng-click event propagation
                    element.off('click');
                    element.on('click', function(e) {
                        e.preventDefault();

                        $validation.validate(form).success(function() {
                            $parse(attrs.ngClick)(scope);
                        });
                    });
                });

            }
        };
    }
]);

angular.module('common').directive('validationReset', ['$validation', '$timeout', '$parse', function($validation, $timeout, $parse) {

        return {
            link: function postLink(scope, element, attrs) {
                var form = $parse(attrs.validationReset)(scope);

                $timeout(function() {
                    element.on('click', function(e) {
                        e.preventDefault();
                        $validation.reset(form);
                    });
                });

            }
        };
    }
]);
