'use strict';

angular.module('purchase').controller('ReviewPurchaseController', ['$scope', '$rootScope', '$stateParams', 'config', '$validation', 'toaster', '$upload',
function ($scope, $rootScope, $stateParams, config, $validation, toaster, $upload) {

    var id = (!_.isUndefined($stateParams.id)) ? $stateParams.id : null;
    if(id != null){
        $scope.project = ProjectResource.get({id: id});
        $scope.notes = NoteResource.findAll({project: id, page: 1});
        $scope.documents = [];
//        $scope.documents = DocumentResource.findAll({project: id, page: 1});
    }
}]);