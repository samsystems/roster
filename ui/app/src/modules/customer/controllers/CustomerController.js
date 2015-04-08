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

        $scope.onFileImport = function () {
            var file = $scope.uploadFile;
            var reader=new FileReader();
            reader.readAsText(file[0]);
            var string=reader.result;
            var csv = CSVToArray(string);
            console.log(csv);
            return;
            $scope.upload = $upload.upload({
                url: config.api.baseUrl + '/customer/import',
                file: file
            }).progress(function (evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                if (data.id) {
                    $scope.contact.document = data;
                }
            }).error(function () {
                toaster.pop('error', 'Document Upload', 'An error ocurred while trying to upload the selected document. Please try again.');
            });
        };
        $scope.onFileSelect = function ($files) {
            $scope.uploadFile= $files
        };

        $scope.downloadDocument = function (document) {
            $http({
                method: 'GET',
                url: config.api.baseUrl + '/documents/base64/' + document.id + '/' + document.Company.Id
            }).success(function (response) {
                $window.open("data:" + response.type + ";base64, " + response.base64, document.name);
            });
        }
        function CSVToArray( strData, strDelimiter ){
            // Check to see if the delimiter is defined. If not,
            // then default to comma.
            strDelimiter = (strDelimiter || ",");

            // Create a regular expression to parse the CSV values.
            var objPattern = new RegExp(
                (
                    // Delimiters.
                    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                    // Quoted fields.
                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                    // Standard fields.
                    "([^\"\\" + strDelimiter + "\\r\\n]*))"
                    ),
                "gi"
            );


            // Create an array to hold our data. Give the array
            // a default empty first row.
            var arrData = [[]];

            // Create an array to hold our individual pattern
            // matching groups.
            var arrMatches = null;


            // Keep looping over the regular expression matches
            // until we can no longer find a match.
            while (arrMatches = objPattern.exec( strData )){

                // Get the delimiter that was found.
                var strMatchedDelimiter = arrMatches[ 1 ];

                // Check to see if the given delimiter has a length
                // (is not the start of string) and if it matches
                // field delimiter. If id does not, then we know
                // that this delimiter is a row delimiter.
                if (
                    strMatchedDelimiter.length &&
                    strMatchedDelimiter !== strDelimiter
                    ){

                    // Since we have reached a new row of data,
                    // add an empty row to our data array.
                    arrData.push( [] );

                }

                var strMatchedValue;

                // Now that we have our delimiter out of the way,
                // let's check to see which kind of value we
                // captured (quoted or unquoted).
                if (arrMatches[ 2 ]){

                    // We found a quoted value. When we capture
                    // this value, unescape any double quotes.
                    strMatchedValue = arrMatches[ 2 ].replace(
                        new RegExp( "\"\"", "g" ),
                        "\""
                    );

                } else {

                    // We found a non-quoted value.
                    strMatchedValue = arrMatches[ 3 ];

                }


                // Now that we have our value string, let's add
                // it to the data array.
                arrData[ arrData.length - 1 ].push( strMatchedValue );
            }

            // Return the parsed data.
            return( arrData );
        }
    }]);