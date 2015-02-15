'use strict';

angular.module('common').directive('questionSet', ['$rootScope', '$window', 'config', 'DateTimeService', 'QuestionSetService',
    function($rootScope, $window, config, DateTimeService, QuestionSetService) {

        return {
            restrict: 'E',
            require: "?ngModel",
            templateUrl: 'src/modules/common/views/question-set.html',
            replace: false,
            scope: {
                model: '=ngModel',
                orientation: '@',
                groupKey: '@',
                nameKey: '@'
            },
            link: function($scope, ngModel) {
                $scope.model.questionSets = [];
                $scope.visibleQuestionSet = null;

                var questionSetService = QuestionSetService.resource;

                if(!_.isUndefined($scope.groupKey)) {
                    questionSetService.findByGroup({groupKey: $scope.groupKey}, function(questionSets) {
                        $scope.model.questionSets = questionSets;
                        $scope.setAnswers($scope.model.questionSets, $scope.model);
                        $scope.model.questionSets[0].visible = true;
                        $scope.visibleQuestionSet = $scope.model.questionSets[0];
                    });
                }

                if(!_.isUndefined($scope.nameKey)) {
                    questionSetService.findOneByNameKey({nameKey: $scope.nameKey}, function(questionSets) {
                        $scope.model.questionSets = questionSets;
                        $scope.model.questionSets[0].visible = true;
                        $scope.visibleQuestionSet = $scope.model.questionSets[0];
                    });
                }

                $scope.setAnswers = function(questionSets, answers){
                    var answersArray = [];
                    for(var i in answers){
                        var answer = answers[i].answer;
                        if(!_.isUndefined(answers[i].input)){
                            var id = answers[i].input.id;
                            answersArray[ id ] = answer;
                        }
                    }

                    for(var i in questionSets) {
                        var questionSet = questionSets[i];

                        for(var j in questionSet.questions) {
                            var item = questionSet.questions[j];

                            if(!_.isUndefined(item.inputs)) {
                                for(var h in item.inputs) {
                                    var input = item.inputs[h];
                                    if(!_.isUndefined(answersArray[input.id])){
                                        input.answer = answersArray[input.id];
                                    }
                                }
                            }
                        }
                    }
                };

                $scope.switchQuestionSet = function() {
                    $scope.visibleQuestionSet.visible = false;
                    this.questionSet.visible = true;
                    $scope.visibleQuestionSet = this.questionSet;
                };
            }
        };
    }]);
