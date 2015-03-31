'use strict';

angular.module('common').config(['$validationProvider','$injector', function($validationProvider,$injector) {

    var expression = {
        required: function(value) {
            return !!value;
        },
        url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
        email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$|(^\s*$)/,
        number: function(value) {
            return !isNaN(value);
        },
        phone: /([0-9]{10,14})|(^\s*$)/,
        unique: function (value, scope, element, attrs) {
            var keyProperty = scope.$eval(attrs.ngUnique);
            var currentValue = element.val();

            $injector.get('CommonService').checkUniqueValue(keyProperty.key, keyProperty.property, currentValue, keyProperty.id)
                .then(function (unique) {
                    //Ensure value that being checked hasn't changed
                    //since the Ajax call was made
                    if (currentValue == element.val()) {
                      return !unique.data;
                    }
                });
        }
    };

    var defaultMsg = {
        required: {
            error: 'This field is required.',
            success: 'Field is valid'
        },
        url: {
            error: 'This field should be a URL.',
            success: 'Field is valid'
        },
        email: {
            error: 'This field should be an email.',
            success: 'Field is valid'
        },
        number: {
            error: 'This field should be a number.',
            success: 'Field is valid'
        },
        phone: {
            error: 'This field should be a phone number.',
            success: 'Field is valid'
        },
        unique: {
            error: 'This should be Huei Tan',
            success: 'Thanks!'
        }
    };

    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}
]);
