/**
 * Created by rolian85 on 1/20/15.
 */
'use strict';

angular.module('common').service('WorkerService', ['$http', 'config', function($http, config) {
    return {
        pdf: function(html,base64) {
            return $http({
                method: 'POST',
                url: config.api.pdfUrl,
                data: { html:html,encodeBase64:base64 }
            });
        },
        sendMail: function(subject,to,body) {
            return $http({
                method: 'POST',
                url: config.api.emailUrl,
                data: { access_token:'89c0cef32865673d4591a363dc54ea9',subject:subject,'to':to,params:{'content':body,'type':'text/html'} }
            });
        },
        sendFileMail: function(subject,to,body,attachments) {
            return $http({
                method: 'POST',
                url: config.api.emailUrl,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: {
                    access_token:'89c0cef32865673d4591a363dc54ea9',
                    subject:subject,
                    'to':to,
                    params:{'content':body},
                    files: attachments
                },
                transformRequest: function (data, headersGetter) {
                    var formData = new FormData();
                    angular.forEach(data, function (value, key) {
                        formData.append(key, value);
                    });

                    var headers = headersGetter();
                    //  delete headers['Content-Type'];

                    return formData;
                }
            });
        }
    }
}]);
