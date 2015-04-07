'use strict';

angular.module('customer').controller('CustomerController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Customer', 'State', 'ngTableParams', '$filter', '$q', '$state', '$upload', '$http', '$window',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Customer, State, ngTableParams, $filter, $q, $state, $upload, $http, $window) {

        $scope.page = 1;
        $scope.total = 0;
        $scope.search = {customer: ""};

        $scope.states = State.$search();

        $scope.limitInPage = config.application.limitInPage;

        $scope.search = function (term) {
            $scope.customerTable.reload();
        };

        $scope.refresh = function () {
            $scope.searchCustomer = '';
        };

        $scope.customerTable = new ngTableParams({
            page: 1,            // show first page
            count: 20           // count per page
        }, {
            total: 0, // length of data
            getData: function ($defer, params) {
                var customers = Customer.$search({page: params.page(), sort: params.orderBy(), keyword: $scope.search.customer});
                var total = Customer.count($scope.search.customer);
                $q.all([customers.$asPromise(), total]).then(function (data) {
                    $scope.total = data[1].data.total;
                    params.total(data[1].data.total);
                    $defer.resolve(data[0]);
                })
            }
        });
        $scope.viewCustomer = function (customer) {
            $state.go('app.customer-view', {id: customer.Id});
        }
        $scope.editCustomer = function (customer) {

            $state.go('app.customer-update', {id: customer.Id});
        }
        $rootScope.$on('customer::deleted', function ($event) {
            $scope.customerTable.reload();
        });

        $scope.removeCustomer = function (customer) {
            dialogs.confirm('Remove a Customer', 'Are you sure you want to remove a Customer?').result.then(function (btn) {
                customer.$destroy().$asPromise().then(function (response) {
                    $rootScope.$broadcast('customer::deleted');
                    toaster.pop('success', 'Customer Deleted', 'You have successfully deleted a customer.')
                });
            });
        };

        $scope.onFileSelect = function () {
            var file = $scope.uploadFile;
            $scope.upload = $upload.upload({
                url: config.api.baseUrl + '/documents',
                data: {
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
        };


        $scope.downloadDocument = function (document) {
            $http({
                method: 'GET',
                url: config.api.baseUrl + '/documents/base64/' + document.id + '/' + document.Company.Id
            }).success(function (response) {
                $window.open("data:" + response.type + ";base64, " + response.base64, document.name);
            });
        }

    }]);