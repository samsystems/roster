'use strict';

angular.module('vendor').controller('VendorController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Vendor', 'ngTableParams', '$filter', '$q', '$state','ExportCSVService',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Vendor, ngTableParams, $filter, $q, $state, ExportCSVService) {

        $scope.page = 1;
        $scope.total = 0;
        $scope.search = {vendor: ""};

        $scope.limitInPage = config.application.limitInPage;

        $scope.search = function (term) {
            $scope.vendorTable.reload();
        };

        $scope.refresh = function () {
            $scope.searchVendor = '';
        };

        $scope.vendorTable = new ngTableParams({
            page: 1,            // show first page
            count: 20           // count per page
        }, {
            total: 0, // length of data
            getData: function ($defer, params) {
                var vendors = Vendor.$search({page: params.page(), sort: params.orderBy(), keyword: $scope.searchVendor});
                var total = Vendor.count($scope.searchVendor);
                $q.all([vendors.$asPromise(), total]).then(function (data) {
                    $scope.total = data[1].data.total;
                    params.total(data[1].data.total);
                    $defer.resolve(data[0]);
                })
            }
        });

        $scope.viewVendor = function (vendor) {
            $state.go('app.vendor-view', {id: vendor.Id});
        }
        $scope.editVendor = function (vendor) {
            $state.go('app.vendor-update', {id: vendor.Id});
        }
        $rootScope.$on('vendor::deleted', function ($event) {
            $scope.vendorTable.reload();
        });

        $scope.removeVendor = function (vendor) {
            dialogs.confirm('Remove a Vendor', 'Are you sure you want to remove a Vendor?').result.then(function (btn) {
                vendor.$destroy().$asPromise().then(function (response) {
                    $rootScope.$broadcast('vendor::deleted');
                    toaster.pop('success', 'Vendor Deleted', 'You have successfully deleted a vendor.')
                });
            });
        };


        $scope.onFileImport = function () {
            var file = $scope.uploadFile;
            var reader = new FileReader();
            reader.readAsText(file[0]);
            var stringCsv = reader.result;
            var csv = CSVToArray(stringCsv, ";");
            console.log(file);
            console.log(stringCsv);
            console.log(csv);

            for (var i = 1; i <= csv.length; i++) {
                if (csv[i] && csv[i][0]) {
                    var vendor = Vendor.$build();
                    if (csv[i][0])
                        vendor.Name = csv[i][0];
                    if (csv[i][1])
                        vendor.Phone = csv[i][1];
                    if (csv[i][2])
                        vendor.Mobile = csv[i][2];
                    if (csv[i][3])
                        vendor.Fax = csv[i][3];
                    if (csv[i][4])
                        vendor.CompanyName = csv[i][4];
                    if (csv[i][5])
                        vendor.WebSite = csv[i][5];
                    if (csv[i][6])
                        vendor.AccountNumber = csv[i][6];
                    // customer.BillingLocationId = csv[i][7];
                    // customer.ShippingLocationId = csv[i][8];
                    if (csv[i][7])
                        vendor.TrackTransaction = (csv[i][7] == 1) ? true : false;
                    if (csv[i][8])
                        vendor.Tax = csv[i][8];
                    if (csv[i][9])
                        vendor.BankAccount = csv[i][9];
                    if (csv[i][10])
                        vendor.BankAccountName = csv[i][10];
                    if (csv[i][11])
                        vendor.BatchPaymentsDetails = csv[i][11];

                    //BillingLocation
                    vendor.Location = {};
                    if (csv[i][12])
                        vendor.Location.Address = csv[i][12];
                    if (csv[i][13])
                        vendor.Location.Address1 = csv[i][13];
                    if (csv[i][14])
                        vendor.Location.City = csv[i][14];
                    if (csv[i][15])
                        vendor.Location.State = {Id: csv[i][15]};
                    if (csv[i][16])
                        vendor.Location.Zipcode = csv[i][16];

                    //Contacts
                    vendor.Contacts = [];
                    var count = 0;
                    for (var j = 17; j < csv[i].length; j += 5) {
                        if (csv[i][j]) {
                            vendor.Contacts[count] = {
                                "Name": csv[i][j],
                                "LastName": csv[i][j + 1],
                                "Phone": csv[i][j + 2],
                                "Email": csv[i][j + 3],
                                "IncludeEmail": (csv[i][j + 4] == 1) ? true : false
                            }
                            count++;
                        }
                        else
                            break;
                    }
                    console.log('aqui');
                    vendor.$save().$then(function (response) {
                        $rootScope.$broadcast('vendor::created');
                        toaster.pop('success', 'vendor Created', 'You have successfully created a new vendor.');
                        $state.go("app.vendor");
                    }, function () {
                        toaster.pop('error', 'Error', 'Something went wrong a new Vendor could not be created');
                    });
                }
            }


            return;
            /* $scope.upload = $upload.upload({
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
             });*/
        };
        $scope.onFileSelect = function ($files) {
            $scope.uploadFile = $files
        };

        $scope.downloadDocument = function (document) {
            $http({
                method: 'GET',
                url: config.api.baseUrl + '/documents/base64/' + document.id + '/' + document.Company.Id
            }).success(function (response) {
                $window.open("data:" + response.type + ";base64, " + response.base64, document.name);
            });
        }
        function CSVToArray(strData, strDelimiter) {
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
            var arrData = [
                []
            ];

            // Create an array to hold our individual pattern
            // matching groups.
            var arrMatches = null;


            // Keep looping over the regular expression matches
            // until we can no longer find a match.
            while (arrMatches = objPattern.exec(strData)) {

                // Get the delimiter that was found.
                var strMatchedDelimiter = arrMatches[ 1 ];

                // Check to see if the given delimiter has a length
                // (is not the start of string) and if it matches
                // field delimiter. If id does not, then we know
                // that this delimiter is a row delimiter.
                if (
                    strMatchedDelimiter.length &&
                    strMatchedDelimiter !== strDelimiter
                    ) {

                    // Since we have reached a new row of data,
                    // add an empty row to our data array.
                    arrData.push([]);

                }

                var strMatchedValue;

                // Now that we have our delimiter out of the way,
                // let's check to see which kind of value we
                // captured (quoted or unquoted).
                if (arrMatches[ 2 ]) {

                    // We found a quoted value. When we capture
                    // this value, unescape any double quotes.
                    strMatchedValue = arrMatches[ 2 ].replace(
                        new RegExp("\"\"", "g"),
                        "\""
                    );

                } else {

                    // We found a non-quoted value.
                    strMatchedValue = arrMatches[ 3 ];

                }


                // Now that we have our value string, let's add
                // it to the data array.
                arrData[ arrData.length - 1 ].push(strMatchedValue);
            }

            // Return the parsed data.
            return( arrData );
        }

        $scope.exportToCSV = function(){
            ExportCSVService.export('vendor');
        }
    }]);