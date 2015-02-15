'use strict';

angular.module('group').directive('groupWizard', ['Group','DateTimeService', 'VesselService', 'config', '$modal', '$rootScope', 'dialogs', 'toaster', '$validation', 'WizardHandler',
    function (Group,  DateTimeService, VesselService, config , $modal , $rootScope, dialogs, toaster, $validation, WizardHandler) {

        return {
            restrict: 'E',
            templateUrl: 'src/modules/group/views/group-wizard.html',
            replace: false,
            link: function($scope) {
                var groupResource = Group.resource;

                $scope.group = {};

                $scope.groups = groupResource.findUserGroups({vesselId: config.application.vesselId});

                $scope.step = {
                    list:          'list',
                    form:          'form'
                };

                $scope.$goTo = function(step) {
                    WizardHandler.wizard().goTo(step);
                };

                $scope.create = function() {
                    $scope.$goTo($scope.step.form);
                };

                $scope.getList = function() {
                    $scope.$goTo($scope.step.list);
                };

                $scope.selectRow = function(index, group) {
                    $scope.group = groupResource.get({groupId: group.id});

                    //save data
                    $scope.$goTo($scope.step.form);
                };

                $scope.$close = function() {
                    $scope.$goTo($scope.step.list);
                };

                $scope.save = function() {
                    $validation.validate($scope, 'group').success(function() {
                        var group           = new groupResource();
                        group.name          = $scope.group.name;
                        group.description   = $scope.group.description;
                        group.email         = $scope.group.email;
                        group.nameId        = $scope.group.name;
                        group.deleted       = false;

                        group.$save({}, function(response) {
                            $rootScope.$broadcast('group::created', response);

                            toaster.pop('success', 'Group created', 'You have successfully created teh group.');
                            $scope.$goTo($scope.step.list);
                        }, function() {
                            toaster.pop('error', 'Error', 'Something went wrong, the new group couldn\'t be created');
                        });

                    }).error(function() {
                        return console.log('error');
                    });

                }; // end of ok function

                $scope.remove = function(index, group) {

                    dialogs.confirm('Remove selected group?', 'Are you sure you want to remove the selected group?').result.then(function(btn){
                        group.$delete( function() {
                            var index = $scope.groups.indexOf(group);
                            if(index > -1) {
                                $scope.groups.splice(index, 1);
                                toaster.pop('success', 'Group removed', 'You Have Successfully removed the selected group')
                            }else {
                                toaster.pop('error', 'Something went wrong', 'Could not remove the selected group')
                            }
                        });

                    });
                };

            }
        };

    }]);
