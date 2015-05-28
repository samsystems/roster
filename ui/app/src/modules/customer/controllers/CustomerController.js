'use strict';

angular.module('customer').controller('CustomerController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', 'Customer', 'Contact', 'State', 'ngTableParams', '$filter', '$q', '$state', '$upload', '$http', '$window',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, Customer, Contact, State, ngTableParams, $filter, $q, $state, $upload, $http, $window) {

        $scope.page = 1;
        $scope.total = 0;
        $scope.search = {customer: ""};

        $scope.states = State.$search();

        $scope.limitInPage = config.application.limitInPage;

        $scope.search = function () {
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
                var customers = Customer.$search({page: params.page(), sort: params.orderBy(), keyword: $scope.searchCustomer});
                var total = Customer.count($scope.searchCustomer);
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
            var reader = new FileReader();
            reader.readAsText(file[0]);
            var stringCsv = reader.result;
            var csv = CSVToArray(stringCsv, ";");
            console.log(file);
            console.log(stringCsv);
            console.log(csv);

            for (var i = 1; i <= csv.length; i++) {
                if (csv[i] && csv[i][0]) {
                    var customer = Customer.$build();
                    if (csv[i][0])
                        customer.Name = csv[i][0];
                    if (csv[i][1])
                        customer.Phone = csv[i][1];
                    if (csv[i][2])
                        customer.Mobile = csv[i][2];
                    if (csv[i][3])
                        customer.Fax = csv[i][3];
                    if (csv[i][4])
                        customer.CompanyName = csv[i][4];
                    if (csv[i][5])
                        customer.WebSite = csv[i][5];
                    if (csv[i][6])
                        customer.AccountNumber = csv[i][6];
                    // customer.BillingLocationId = csv[i][7];
                    // customer.ShippingLocationId = csv[i][8];
                    if (csv[i][9])
                        customer.IsTaxable = (csv[i][9] == 1) ? true : false;
                    if (csv[i][10])
                        customer.Tax = csv[i][10];
                    if (csv[i][11])
                        customer.Discount = csv[i][11];
                    if (csv[i][12])
                        customer.BankAccount = csv[i][12];
                    if (csv[i][13])
                        customer.BankAccountName = csv[i][13];
                    if (csv[i][14])
                        customer.BatchPaymentsDetails = csv[i][14];
                    if (csv[i][15])
                        customer.OutStanding = parseFloat(csv[i][15]);
                    if (csv[i][16])
                        customer.OverDue = parseFloat(csv[i][16]);

                    //BillingLocation
                    customer.BillingLocation = {};
                    if (csv[i][17])
                        customer.BillingLocation.Address = csv[i][17];
                    if (csv[i][18])
                        customer.BillingLocation.Address1 = csv[i][18];
                    if (csv[i][19])
                        customer.BillingLocation.City = csv[i][19];
                    if (csv[i][20])
                        customer.BillingLocation.State = {Id: csv[i][20]};
                    if (csv[i][21])
                        customer.BillingLocation.Zipcode = csv[i][21];

                    //ShippingLocation
                    customer.ShippingLocation = {};
                    if (csv[i][22])
                        customer.ShippingLocation.Address = csv[i][22];
                    if (csv[i][23])
                        customer.ShippingLocation.Address1 = csv[i][23];
                    if (csv[i][24])
                        customer.ShippingLocation.City = csv[i][24];
                    if (csv[i][25])
                        customer.ShippingLocation.State = {Id: csv[i][25]};
                    if (csv[i][26])
                        customer.ShippingLocation.Zipcode = csv[i][26];


                    //  customer.BillingLocation = $scope.customer.BillingLocation;
                    //   customer.ShippingLocation = $scope.customer.ShippingLocation;

                    //Contacts
                    customer.Contacts = [];
                    var count = 0;
                    for (var j = 27; j < csv[i].length; j += 5) {
                        if (csv[i][j]) {
                            customer.Contacts[count] = {
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
                    customer.$save().$then(function (response) {
                        $rootScope.$broadcast('customer::created');
                        toaster.pop('success', 'Customer Created', 'You have successfully created a new customer.');
                        $state.go("app.customer");
                    }, function () {
                        toaster.pop('error', 'Error', 'Something went wrong a new Customer could not be created');
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
    }])
;