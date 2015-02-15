'use strict';

angular.module('contact').controller('ContactListController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Contact','ngTableParams','$filter','$q', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Contact, ngTableParams,$filter, $q) {

    var contactResource         = Contact.resource;

    $scope.page = 1;
    $scope.searchContact = '';
    var contactOwner=$rootScope.contactOwner;
    var contactIdOwner=$rootScope.contactIdOwner;
    $scope.limitInPage = config.application.limitInPage;

    $scope.search = function(term) {
        $scope.contactTable.reload()
    };

    $scope.refresh = function() {
        $scope.searchContact = '';
    };

    $scope.contactTable = new ngTableParams({
        page: 1,            // show first page
        count: 5           // count per page
    }, {
        total: 0, // length of data
        getData: function($defer, params) {
            var sort = params.orderBy() != false ? params.orderBy() : 'notSorting';
            var contacts = null;
            if( !_.isUndefined($scope.searchContact) && $scope.searchContact != '') {
                contacts = contactResource.findByKeyword({owner : contactOwner,idowner : contactIdOwner,keyword: $scope.searchContact, page: params.page(), order: sort});
                $scope.total = contactResource.findCountByKeyword({owner : contactOwner,idowner : contactIdOwner,keyword: $scope.searchContact});
            }
            else {
                contacts = contactResource.findAll({owner : contactOwner,idowner : contactIdOwner,page: params.page(), order: sort});
                $scope.total = contactResource.findCount({owner : contactOwner,idowner : contactIdOwner});
            }
            $q.all([contacts.$promise,$scope.total.$promise]).then(function(data){
                params.total($scope.total.count);
                $defer.resolve(data[0]);
            })
        }
    });

    $scope.$watch('searchContact', function(data) {
        $scope.search();
    });


    $rootScope.$on('contact::created', function(event) {
        $scope.contactTable.reload();
    });

    $rootScope.$on('contact::updated', function(event) {
        $scope.contactTable.reload();
    });

    $rootScope.$on('contact::deleted', function($event) {
        $scope.contactTable.reload();
    });

    $scope.removeContact = function(contact) {
        dialogs.confirm('Remove a Contact', 'Are you sure you want to remove a Contact?').result.then(function(btn){
            contact.$delete({owner : contactOwner,id: contact.id}, function (response) {
                $rootScope.$broadcast('contact::deleted');
                toaster.pop('success', 'Contact Deleted', 'You have successfully deleted a contact.')
            });
        });
    };
}]);