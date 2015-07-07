'use strict';

angular.module('bill').controller('BillFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$state', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Bill', 'Country', 'State', 'Customer', 'Product', 'User', 'Company',
    function ($scope, $rootScope, $stateParams, config, $state, $modal, dialogs, DateTimeService, toaster, $validation, Bill, Country, State, Customer, Product, User, Company) {

        $scope.bill = {};
        $scope.Type = (!_.isUndefined($stateParams.type)) ? $stateParams.type : 'bill';
        $scope.bill.Type = (!_.isUndefined($stateParams.type)) ? $stateParams.type : 'bill';

        $scope.states = State.$search();
        User.$find(User.getCurrentUserId()).$asPromise().then(function (user) {
            Company.$find(user.Company.Id).$asPromise().then(function (company) {
                //  $scope.tax = 7;
                $scope.tax = company.Tax;
            });
        });

        var flagStatusBill = [
            {"value": "open", "description": "Open"},
            {"value": "partial", "description": "Partial"},
            {"value": "paid", "description": "Paid"},
            {"value": "overdue", "description": "Overdue"},
            {"value": "completed", "description": "Completed"},
            {"value": "void", "description": "Void"}
        ];


        $scope.currencies = [
            {"value": "USD", "description": "USD United States Dollar"}
        ];
        $scope.now = DateTimeService.nowIsoFormat();

        if ($scope.bill.Type == 'bill')
            $scope.flagStatus = flagStatusBill;
        else
            $scope.flagStatus = flagStatusEstimate;

        $scope.TitleNumber = '';
        if (!_.isUndefined($stateParams.id)) {
            $scope.bill = Bill.$find($stateParams.id).$then(function () {
                /*    if ($scope.invoice.Status != 'draft') {
                 disable(true, invoice);
                 } else
                 disable(false, invoice);*/
                $scope.TitleNumber = $scope.bill.OrderNumber;
                $scope.bill.itemProducts.$fetch().$asPromise().then(function (response) {
                    for (var i = 0; i < response.length; i++) {
                        response[i] = {
                            Id: ($stateParams.action == 'update') ? response[i].Id : null,
                            Product: response[i].Product,
                            Price: response[i].Product.Price,
                            Quantity: response[i].Quantity,
                            QuantitySave: parseInt(response[i].Quantity)
                        };
                    }
                    $scope.bill.itemProducts = response;

                    delete $scope.bill.Updater;
                    delete $scope.bill.SubTotal;
                    delete $scope.bill.TotalTax;
                    delete $scope.bill.Amount;
                })
                if ($stateParams.action == 'copyto') {
                    $scope.bill.Status = 'open';
                    $scope.bill.Id = null;
                }
                $scope.Type = $scope.bill.Type;
            });


        } else {
            $scope.bill = Bill.$build();
            $scope.bill.Currency = 'USD';
            $scope.bill.Date = DateTimeService.nowIsoFormat();
            $scope.bill.itemProducts.$build().$reveal();

            /*var invoiceNumber = Invoice.maxOrderNumber($scope.Type).success(function (response) {
                $scope.invoice.OrderNumber = response.max;
            });*/
        }



        // TODO: implement Invoice.getMaxOrderNumber()
//       $scope.invoice.invoiceNumber = 500;
        $scope.searchCustomers = function (val) {
            return Customer.$search({keyword: val, page: 1, order: 'notSorting'}).$asPromise().then(function (customers) {
                if (customers == null)
                    return {};
                else
                    return customers;
            });
        };


        $scope.searchItems = function (val) {
            return Product.$search({keyword: val, page: 1, order: 'notSorting'}).$asPromise().then(function (products) {
                return products;
            });
        };

        $scope.addProduct = function (index) {
            $scope.bill.itemProducts.$build().$reveal();

        }

        $scope.removeProduct = function (product) {
            $scope.bill.itemProducts.$remove(product);
        }

        $scope.getAmount = function (item) {
            var quantity = (!isNaN(item.Quantity) && item.Quantity != "") ? parseInt(item.Quantity) : 0;
            var price = (!isNaN(item.Price) && item.Price != "") ? parseFloat(item.Price) : 0;
            var discount = (!isNaN(item.DiscountPrice) && item.DiscountPrice != "") ? parseFloat(item.DiscountPrice) : 0;
            return  ( quantity * price ) - ( quantity * price * discount / 100);
        }

        $scope.bill.TotalTax = 7;
        $scope.getTotal = function (product) {
            var total = 0;
//            var tax = (!isNaN($scope.invoice.TotalTax) && $scope.invoice.TotalTax != "") ? parseInt($scope.invoice.TotalTax) : 7;

            var tax = (!isNaN($scope.bill.TotalTax) && $scope.bill.TotalTax != "") ? parseInt($scope.bill.TotalTax) : 7;
            _.each($scope.bill.itemProducts, function (item) {
                total += $scope.getAmount(item);
            })
            $scope.total = total;
            return  ( total) + ( total * tax / 100);
        }

        $scope.addItem = function (product, $index) {
            if (!_.isEmpty(product) && !_.isEmpty(product.Id)) {
                $scope.subtotal = 0;
                for (var i = 0; i < $scope.bill.itemProducts.length; i++) {

                    if (!_.isEmpty($scope.bill.itemProducts[i].Product.Id)) {
                        if ($scope.bill.itemProducts[i].Product.Id == product.Id) {
                            toaster.pop('error', 'Error', 'The product has already been added');
                            return;
                        }
                    }
                }
                var item = {Product: product, Price: product.Price, DiscountPrice: product.DiscountPrice, Quantity: '1'};
                $scope.bill.itemProducts[$index] = item;
            } else {
                toaster.pop('error', 'Error', 'Select an item');
            }
        };

        /*
         $scope.saveQuantity = function (item) {
         if (item.product.stock < item.quantity)
         toaster.pop('error', 'Error', 'The maximum quantity in stock is ' + item.product.stock);
         };
         */
//        $scope.removeItem = function (item) {
//            if (!_.isEmpty(item)) {
//                for (var i = 0; i < $scope.invoice.InvoiceProducts.length; i++) {
//                    if ($scope.invoice.InvoiceProducts[i].Product.Id == item.Product.Id) {
//                        $scope.invoice.InvoiceProducts.splice(i, 1);
//                    }
//                }
//            }
//        };

        $scope.searchProducts = function (val) {
            return Product.$search({keyword: val, page: 1, order: 'notSorting'}).$asPromise().then(function (products) {
                return products;
            });
        };

        $scope.addProduct = function (index) {
            $scope.invoice.itemProducts.$build().$reveal();
        }

        $scope.removeProduct = function (product) {
            $scope.invoice.itemProducts.$remove(product);
        }

        $scope.updateSubTotal = function () {
            $scope.subtotal = 0;
            $scope.total_amount = 0;
            if ($scope.bill && $scope.bill.itemProducts) {
                for (var i = 0; i < $scope.bill.itemProducts.length; i++) {
                    $scope.subtotal += $scope.bill.itemProducts[i].Quantity * $scope.bill.itemProducts[i].Price;
                }
                $scope.total_tax = $scope.subtotal * $scope.tax / 100;
                $scope.total_amount = $scope.total_tax + $scope.subtotal;
            }
        };

        $scope.save = function (form) {
            $validation.validate(form).success(function () {
                if ($scope.bill.itemProducts.length > 0) {
                    if (!_.isUndefined($scope.bill.Id) && $scope.bill.Id) {
                        $scope.bill.Status = 'open';

                        /*Temporal hasta averiguar la fecha*/
                        /* $scope.invoice.Date = '0001-01-01T00:00:00Z';
                         $scope.invoice.DueDate = '0001-01-01T00:00:00Z';*/

                        $scope.bill.$save().$then(function (response) {
                            $rootScope.$broadcast('bill::updated');
                            toaster.pop('success', 'bill Updated ', 'You have been successfully updated a bill.')
                            $state.go("app.sale");
                        }, function () {
                            toaster.pop('error', 'Error', 'Something went wrong a new Bill could not be created');
                        });
                    } else {

                        var bill = Bill.$build();

                        bill.BillProducts = [];
                        var count = 0;
                        for (var i = 0; i < $scope.bill.itemProducts.length; i++) {
                            if (!_.isUndefined($scope.bill.itemProducts[i].Product))
                                if ($scope.bill.itemProducts[i].Product.Name) {
                                    bill.BillProducts[count] = $scope.bill.itemProducts[i];
                                    count++;
                                }
                        }
                        if (bill.BillProducts.length == 0) {
                            toaster.pop('error', 'Error', 'You must add at least one product.');
                            return;
                        }
                        bill.Customer = {'Id': $scope.bill.Customer.Id};
                        bill.Date = $scope.bill.Date;

                        bill.DeliveryInstruction = $scope.bill.DeliveryInstruction;
                        bill.DueDate = $scope.bill.DueDate;

                        bill.ReferenceNumber = $scope.bill.ReferenceNumber;
                        bill.Currency = $scope.bill.Currency;

                        bill.Status = 'open';
                        bill.Type = $scope.Type;
                        console.log($scope.Type);


                        bill.$save().$then(function (response) {
                            $rootScope.$broadcast('bill::updated');
                            toaster.pop('success', 'Bill Created', 'You have successfully created a new bill.');
                            $state.go("app.sale");
                        }, function () {
                            toaster.pop('error', 'Error', 'Something went wrong a new Bill could not be created');
                        });
                    }
                } else
                    toaster.pop('error', 'Error', 'The bill must have at least one product.');
            }).error(function () {
                toaster.pop('error', 'Error', 'Complete the required entry fields.');
            });
        };

        $scope.removeBill = function (bill) {
            dialogs.confirm('Remove a Bill', 'Are you sure you want to remove a Bill?').result.then(function (btn) {
                bill.$destroy().$then(function () {
                    $rootScope.$broadcast('bill::deleted');
                    toaster.pop('success', 'Bill Deleted', 'You have successfully deleted a bill.')
                });
            });
        };

    }]);