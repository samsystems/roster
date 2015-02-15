'use strict';

angular.module('contact').controller('ContactController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'WizardHandler', 'Contact', '$location', '$state', '$upload','$http','$window', function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, WizardHandler, Contact, $location, $state, $upload,$http,$window) {


    var contactResource = Contact.resource;

    $scope.listContact = 1;
    $scope.formContact = 0;
    $scope.showContact = 0;
    var contactOwner = $rootScope.contactOwner;

    $scope.$goTo = function (step) {
        WizardHandler.wizard().goTo(step);
    };
    $scope.createContact = function () {
        $scope.contact = {
            name: '',
            last_name: '',
            phone: '',
            email: '',
            position: '',
            notes: ''
        };
        angular.forEach(
            angular.element(".bootstrap-filestyle > input"),
            function (inputElem) {
                angular.element(inputElem).val(null);
            });
        $scope.uploadFile = null;
        $scope.listContact = 0;
        $scope.formContact = 1;
        $scope.showContact = 0;
    };

    $scope.getList = function () {
        $scope.listContact = 1;
        $scope.formContact = 0;
        $scope.showContact = 0;
    };

    $scope.selectContact = function (contact) {
        angular.forEach(
            angular.element(".bootstrap-filestyle > input"),
            function (inputElem) {
                angular.element(inputElem).val(null);
            });
        $scope.contact = contactResource.get({owner: contactOwner, id: contact.id});
        $scope.listContact = 0;
        $scope.formContact = 1;
        $scope.showContact = 0;
    };

    $scope.viewContact = function (contact) {
        $scope.contact = contactResource.get({owner: contactOwner, id: contact.id});
        $scope.listContact = 0;
        $scope.formContact = 0;
        $scope.showContact = 1;
    };

    $scope.$close = function () {
        $scope.listContact = 1;
        $scope.formContact = 0;
        $scope.showContact = 0;
    };


    $scope.removeContact = function (contact) {
        dialogs.confirm('Remove a Contact', 'Are you sure you want to remove a Contact?').result.then(function (btn) {
            contact.$delete({owner: contactOwner, id: contact.id}, function (response) {
                $rootScope.$broadcast('contact::deleted');
                toaster.pop('success', 'Contact Deleted', 'You have successfully deleted a contact.')
            });
            $scope.listContact = 1;
            $scope.formContact = 0;
            $scope.showContact = 0;
        });
    };
    /*The formController*/
    $scope.onFileSelect = function ($files) {
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $scope.upload = $upload.upload({
                url: config.api.baseUrl + '/documents',
                data: {
                    organization: {id: config.application.organizationId},
                    documentType: 'GENERAL'
                },
                file: file
            }).progress(function (evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                if (data.id) {
                    $scope.contact.document = data;
                    /*$scope.contact.$update({id: $scope.contact.id}, function(response) {
                     $rootScope.$broadcast('contact::updated', response);
                     toaster.pop('success', 'Document Uploaded', 'You have been successfully uploaded a new document.')
                     });*/
                }
            }).error(function () {
                toaster.pop('error', 'Document Upload', 'An error ocurred while trying to upload the selected document. Please try again.');
            });
        }
    };

    $scope.$save = function () {
        $validation.validate($scope, 'contact').success(function () {

            if (!_.isUndefined($scope.contact.id)) {
                $scope.contact.$update({owner: contactOwner, id: $scope.contact.id}, function (response) {
                    $rootScope.$broadcast('contact::updated');
                    toaster.pop('success', 'Contact Updated ', 'You have been successfully updated a contact.')
                    $scope.listContact = 1;
                    $scope.formContact = 0;
                    $scope.showContact = 0;
                });
            } else {

                var contact = new contactResource();
                contact.name = $scope.contact.name;
                contact.last_name = $scope.contact.last_name;
                contact.phone = $scope.contact.phone;
                contact.email = $scope.contact.email;
                contact.position = $scope.contact.position;
                contact.notes = $scope.contact.notes;
                contact.owner = $rootScope.contactOwner;
                contact.idOwner = $rootScope.contactIdOwner;
                if (!_.isUndefined($scope.contact.document)) {
                    contact.document = $scope.contact.document;
                }

                contact.$save({}, function (response) {
                    $rootScope.$broadcast('contact::created');
                    toaster.pop('success', 'Contact Created', 'You have successfully created a new contact.');
                    $scope.listContact = 1;
                    $scope.formContact = 0;
                    $scope.showContact = 0;
                }, function () {
                    toaster.pop('error', 'Error', 'Something went wrong a new Contact could not be created');
                });
            }

            //$scope.$goTo($scope.step.listContact);
        }).error(function () {
            toaster.pop('error', 'Error', 'Complete the required entry fields.');
        });
    };
    $scope.downloadDocument = function (document) {
        $http({
            method: 'GET',
            url: config.api.baseUrl + '/documents/base64/' + document.id + '/' + config.application.organizationId
        }).success(function (response) {
            $window.open("data:" + response.type + ";base64, " + response.base64, document.name);
        });
    }
}]);