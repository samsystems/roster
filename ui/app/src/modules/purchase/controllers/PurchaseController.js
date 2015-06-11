'use strict';

angular.module('purchase').controller('PurchaseController', ['$scope','PurchaseOrder',
    function ($scope, PurchaseOrder ) {
    $scope.status = {
        all: 'all',
        draft: 'draft',
        awaiting: 'awaiting',
        approved: 'approved',
        billed: 'billed',
        receiving: 'receiving',
        completed: 'completed',
        void: 'void'
    }


    $scope.resume = {};
    PurchaseOrder.getResume($scope.status.draft).then(function(data){
        $scope.resume.draft = data.data;
    });
    PurchaseOrder.getResume($scope.status.awaiting).then(function(data){
        $scope.resume.awaiting = data.data;
    });
    PurchaseOrder.getResume($scope.status.approved).then(function(data){
        $scope.resume.approved = data.data;
    });
    PurchaseOrder.getResume($scope.status.billed).then(function(data){
        $scope.resume.billed = data.data;
    });

}]);