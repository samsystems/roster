'use strict';

angular.module('common').directive('dateTimePicker', ['$timeout', 'config', 'uuid', 'DateTimeService', function($timeout, config, uuid, DateTimeService) {
    return {
        restrict: 'E',
        require: "?ngModel",
        scope: {
            format: '@format',
            placeholder: '@placeholder',
            defaultIsoDate: '@defaultIsoDate',
            readonly: '=readonly',
            ngChange: '&',
            minDate: '=minDate',
            maxDate: '=maxDate',
            allowNull: '=allowNull',
            allowPartialDate: '=allowPartialDate',
            date: '=ngModel'
        },
        replace: true,
        link: function postLink(scope, element, attrs, ngModel) {

            scope.id                    = uuid.v4();
            scope.partialFormats        = config.date.partial;
            scope.approximationLevels   = config.date.approximationLevel;
            scope.defaultDate           = scope.defaultIsoDate ? scope.defaultIsoDate : ngModel.$modelValue;

            if(scope.format == 'date') {
                scope.dateFormat    = config.date.inputFormatDate;
                scope.defaultDate   = !_.isEmpty(scope.defaultDate) ? DateTimeService.inputFormatDate(moment(scope.defaultDate).zone(scope.defaultDate)) : null;
            }
            else {
                scope.dateFormat    = config.date.inputFormatDateTime;
                scope.defaultDate   = !_.isEmpty(scope.defaultDate) ? DateTimeService.inputFormatDateTime(moment(scope.defaultDate).zone(scope.defaultDate)) : null;
            }

            // Timeout to ensure DOM is ready
            $timeout(function() {
                element.datetimepicker({
                    defaultDate: scope.defaultDate
                }).on("dp.change", function (e) {
                    var value   = null;
                    var newDate = null;
                    if(scope.allowPartialDate) {
                        newDate = !_.isEmpty(e.date) ? DateTimeService.isoFormat(moment.utc(e.date)) : null;
                        value = {
                            date: newDate,
                            approximationLevel: e.approximationLevel
                        };
                    }
                    else {
                        newDate = !_.isEmpty(e.date) ? DateTimeService.isoFormat(e.date) : null;
                        value = newDate;
                    }

                    if(angular.toJson(scope.date) !== angular.toJson(value)) {
                        scope.$apply(function() {
                            scope.date = value;
                        });
                    }
                });
            });

            scope.$watch("allowPartialDate",function(newValue) {
                $timeout(function() {
                    if(!_.isUndefined(newValue)) {
                        var allowPartialDate = (newValue === true);
                        element.data("DateTimePicker").setAllowPartialDate(allowPartialDate);
                    }
                });
            });

            scope.$watch('date', function(newValue) {
                $timeout(function() {
                    if(!_.isUndefined(newValue)) {
                        // Partial Dates
                        var newDate = '';
                        if(scope.allowPartialDate && !_.isUndefined(newValue.date)) {
                            if(!_.isEmpty(newValue.date)) {

                                if (scope.format == 'date') {
                                    newDate = DateTimeService.inputFormatDate(moment(newValue.date).zone(0));
                                }
                                else {
                                    newDate = DateTimeService.inputFormatDateTime(moment(newValue.date).zone(0));
                                }

                                element.data("DateTimePicker").setApproximationLevel(newValue.approximationLevel);
                                element.data("DateTimePicker").setDate(newDate);
                            }
                            else {
                                element.data("DateTimePicker").setApproximationLevel(scope.approximationLevels.none);
                                element.data("DateTimePicker").setDate(null);
                            }
                        }
                        // Normal Dates
                        else {
                            if(!_.isEmpty(newValue)) {
                                if (scope.format == 'date') {
                                    newDate = DateTimeService.inputFormatDate(moment.parseZone(newValue));
                                }
                                else {
                                    newDate = DateTimeService.inputFormatDateTime(moment.parseZone(newValue));
                                }

                                element.data("DateTimePicker").setDate(newDate);
                            }
                            else {
                                element.data("DateTimePicker").setDate(null);
                            }
                        }
                    }
                });
            });

            scope.$watch("readonly",function(newValue) {
                $timeout(function() {
                    if (newValue == true) {
                        element.data("DateTimePicker").disable();
                    }
                    else {
                        element.data("DateTimePicker").enable();
                    }
                });
            });

            scope.$watch("minDate",function(newValue) {
                $timeout(function() {
                    if(!_.isUndefined(newValue)) {
                        element.data("DateTimePicker").setMinDate(moment(newValue));
                    }
                });
            });

            scope.$watch("maxDate",function(newValue) {
                $timeout(function() {
                    if(!_.isUndefined(newValue)) {
                        element.data("DateTimePicker").setMaxDate(moment(newValue));
                    }
                });
            });

            scope.clear = function() {
                if(scope.allowPartialDate) {
                    scope.date = {
                        date: null,
                        format: null
                    };
                }
                else {
                    scope.date = null;
                }
            };
        },
        template: '<div id="{{id}}" class="input-group date">' +
            '<input type="text" class="form-control" readonly="true" placeholder="{{placeholder}}" data-date-format="{{dateFormat}}" data-partial-format-year="{{partialFormats.year}}" data-partial-format-month="{{partialFormats.month}}" data-partial-format-day="{{partialFormats.day}}" data-partial-format-hour="{{partialFormats.hour}}" data-partial-format-minute="{{partialFormats.minute}}" data-approximation-level-none="{{approximationLevels.none}}" data-approximation-level-year="{{approximationLevels.year}}" data-approximation-level-month="{{approximationLevels.month}}" data-approximation-level-day="{{approximationLevels.day}}" data-approximation-level-hour="{{approximationLevels.hour}}" data-approximation-level-minute="{{approximationLevels.minute}}" />' +
            '<span class="input-group-addon datepickerbutton"><span class="fa fa-calendar"></span></span>' +
            '<span class="input-group-addon" ng-if="allowNull"><span class="fa fa-times" ng-click="clear()"></span></span>' +
            '</div>'
    };
}
]);