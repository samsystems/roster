'use strict';

angular.module('group').controller('GroupController', [ 'Group', '$scope', '$rootScope', 'DateTimeService', 'config', '$modal' ,'toaster' , 'dialogs', 'PermissionService', function (Group, $scope, $rootScope, DateTimeService, config , $modal, toaster, dialogs , PermissionService) {

    $scope.isShore = true;
    $scope.currentDate = DateTimeService.nowIsoFormat();
    $scope.tableRowPopOver = false;
	$scope.more = true;
    $scope.page = 1;
    $scope.more2 = true;
    $scope.page2 = 1;

    var UserGroupResource = Group.resource;
    var PermissionResource = PermissionService.resource;


    $scope.selectTableRow = function (index,group) {
    	$scope.open('lg', group);	    	
	};
    
	$scope.addGroup = function() {
		$scope.add('lg');	
	};

	$scope.open = function (size ,group) {
    	var modalInstance = $modal.open({
		    templateUrl: 'src/modules/Group/views/group-modal.html',
		    controller: SelectGroupModalController,
		    size: size,
		    resolve: {
		        group: function () {
		          return group;
		        }
		    }
	    });	  
	  };

	  $scope.add = function (size) {
    	var modalInstance = $modal.open({
		    templateUrl: 'src/modules/Group/views/group-modal.html',
		    controller: CreateGroupModalController,
		    size: size,
	    });	  
	  };

	var CreateGroupModalController = function ($scope, $modalInstance) {
		$scope.modal = [];
		$scope.modal.Options = PermissionResource.fetch();
		console.log($scope.modal.Options)
		$scope.ok = function () {
		var group = new UserGroupResource();
		group.name = $scope.modal.name;
		group.email = $scope.modal.email;
		group.description = $scope.modal.description;

        group.$save(function(response) {
                console.log("updated")
                console.log(response)  
                if(response != null) {
                	loadGroupTable();
                	toaster.pop('success', 'Added a Group', 'You Have Successfully Added a Group.')
                } else{
                	toaster.pop('error', 'Error', 'Something went wrong, a new Group could not be added')
                }     
                $scope.$close();
        });
          	
		    $modalInstance.close();
		};

		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};
	};


	var SelectGroupModalController = function ($scope, $modalInstance, group) {

		$scope.modal = [];
		$scope.modal.id = group.id;
		$scope.modal.name = group.name;
		$scope.modal.email = group.email;	
		$scope.modal.description = group.description;

		$scope.ok = function () {

			var group = new UserGroupResource();
			group.id = $scope.modal.id;
			group.name = $scope.modal.name;
			group.email = $scope.modal.email;
			group.description = $scope.modal.description;
         	group.$update({id: group.id}, function(response) {
                loadGroupTable();
                toaster.pop('success', 'Updated a Group', 'You Have Successfully Updated a Group.')	
            });
		  	$modalInstance.close();
		};

		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};
	};   

    var loadGroupTable = function() {
         $scope.Groups = UserGroupResource.findUserGroups();               
    };

    loadGroupTable();

    $scope.fetchGroupById = function(id) {
    	return UserGroupResource.findById({id: id});
    };

    $scope.removeGroup = function(index, group) {

    	dialogs.confirm('Remove a Group', 'Are you sure you want to remove a Group?').result.then(function(btn){
        	group.$delete({id: group.id}, function() {
                var index = $scope.Groups.indexOf(group);
                if(index > -1) {
                    $scope.Groups.splice(index, 1);
                }
        	});
        	toaster.pop('success', 'Deleted Group', 'You Have Successfully deleted a Group.')
        });

    };

    $rootScope.$on('group::created', function(event, group) {
        if(!_.isEmpty(group)) {
            $scope.groups.push(group);
        }
    });

}]);