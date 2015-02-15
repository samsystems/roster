'use strict';

angular.module('purchase').controller('ReviewPurchaseController', ['$scope', '$rootScope', '$stateParams', 'config', 'DateTimeService', 'Note', 'ProjectService', '$validation', 'toaster', '$upload', 'DocumentService', function ($scope, $rootScope, $stateParams, config, DateTimeService, Note, ProjectService, $validation, toaster, $upload, DocumentService) {

    var ProjectResource = ProjectService.resource;
    var NoteResource = Note.resource;
    var DocumentResource            = DocumentService.resource;

    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
    if(id != null){
        $scope.project = ProjectResource.get({id: id});
        $scope.notes = NoteResource.findAll({project: id, page: 1});
        $scope.documents = [];
//        $scope.documents = DocumentResource.findAll({project: id, page: 1});
    }
}]);