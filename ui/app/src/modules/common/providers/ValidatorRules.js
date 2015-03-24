'use strict';

angular.module('common').config(['$validationProvider', function($validationProvider) {

    var expression = {
        required: function(value) {
            return !!value;
        },
        url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
        email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$|(^\s*$)/,
        number: function(value) {
            return !isNaN(value);
        },
        phone: /([0-9]{10,14})|(^\s*$)/
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
        }
    };

    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}
]);
