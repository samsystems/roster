'use strict';

angular.module('common').factory('QuestionSetService', ['$resource', '$window', 'config', function($resource, $window, config){

    var service = {};

    service.resource = $resource(config.api.baseUrl + '/question-sets/', {}, {
        'findOneByNameKey' : {
            method: 'GET',
            isArray: true,
            url: config.api.baseUrl + '/question-sets/search-by-name-key/:nameKey',
            params: {
                nameKey: '@nameKey'
            }
        },
        'findByGroup' : {
            method: 'GET',
            cache: true,
            isArray: true,
            url: config.api.baseUrl + '/question-sets/search-by-group/:groupKey',
            params: {
                groupKey: '@groupKey'
            }
        },
        'findByEntity' : {
            method: 'GET',
            isArray: true,
            url: config.api.baseUrl + '/question-sets/search-by-entity/:entityName/:id',
            params: {
                entityName: '@entityName',
                id: '@id'
            },
            loadingBarText: 'Loading questions'
        }
    });

    service.getAnswers = function(questionSets){
        var values = [];
        for(var i in questionSets) {
            var questionSet = questionSets[i];

            for(var j in questionSet.questions) {
                var item = questionSet.questions[j];

                if(!_.isUndefined(item.inputs)) {
                    for(var h in item.inputs) {
                        var input = item.inputs[h];
                        if(!_.isUndefined(input.answer)){
                            var valueType = (_.isUndefined(input.valueType)) ? "string" : input.valueType;
                            if(_.isUndefined(values[item.id]))
                                values[item.id] = {};

                            if(_.isUndefined(values[item.id][input.id]))
                                values[item.id][input.id] = {};

                            values[item.id][input.id]['type'] = valueType;
                            values[item.id][input.id]['value'] = input.answer;
                        }
                    }
                }
            }
        }
        return values;
    }

    return service;
}]);