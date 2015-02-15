'use strict';

angular.module('common').directive('wizardsContainer', ['$compile', 'toaster', 'WizardService', 'WizardHandler',
    function($compile, toaster, WizardService, WizardHandler) {

    return {
        restrict: 'E',
        templateUrl: 'src/modules/common/views/wizards-container.html',
        replace: false,
        scope: {
            templateId: '=',
            moduleId:   '='
        },
        link: function(scope, element, attrs) {

            var wizardResource = WizardService.resource;

            scope.$watch('templateId', function(newValue) {
                if(!_.isUndefined(newValue)) {

                    scope.wizards = {
                        available: wizardResource.searchByTemplateId({templateId: scope.templateId}),
                        loaded: []
                    }
                }
            });

            scope.$watch('moduleId', function(newValue) {
                if(!_.isUndefined(newValue)) {
                    scope.wizards = {
                        available: wizardResource.searchByModuleId({moduleId: scope.moduleId}),
                        loaded: []
                    }

                }
            });

            scope.toggle = function(wizard) {
                var wizardOffset = scope.wizards.loaded.indexOf(wizard);

                // If the wizard is not loaded yet, load it
                if(wizardOffset === -1) {
                    wizard.directiveHtml = wizard.directive ? "<" + wizard.directive + "><\/" + wizard.directive + ">" : '';

                    if(wizard.directiveHtml == '') {
                        toaster.pop('error', 'Invalid wizard', 'The wizard that tried to load doesn\'t have a valid directive associated.');
                    }
                    else {
                        wizard.active = true;
                        scope.wizards.loaded.push(wizard);

                        wizardOffset = scope.wizards.loaded.indexOf(wizard);
                    }
                }
                // If it's loaded just toggle it's visibility
                else {
                    scope.wizards.loaded[wizardOffset].active = !scope.wizards.loaded[wizardOffset].active;
                }

                // Hide the rest of the wizards
                for(var i=0; i<scope.wizards.loaded.length; i++) {
                    if(i != wizardOffset) {
                        scope.wizards.loaded[i].active = false;
                    }
                }
            };

            scope.$close = function() {
                var wizardOffset = scope.wizards.loaded.indexOf(this.wizard);

                scope.wizards.loaded[wizardOffset].active = false;
                scope.wizards.loaded.splice(wizardOffset, 1);
            };

            scope.$goTo = function(step) {
                WizardHandler.wizard().goTo(step);
            }
        }
    };
}]);