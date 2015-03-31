'use strict';

angular.module('sale').controller('InvoiceFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$state', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Invoice', 'Country', 'State', 'Customer', 'Product', 'User', 'Company',
    function ($scope, $rootScope, $stateParams, config, $state, $modal, dialogs, DateTimeService, toaster, $validation, Invoice, Country, State, Customer, Product, User, Company) {


        $scope.type = (!_.isUndefined($stateParams.type)) ? $stateParams.type : null;

        $scope.states = State.$search();
        User.$find(User.getCurrentUserId()).$asPromise().then(function (user) {
            Company.$find(user.Company.Id).$asPromise().then(function (company) {
                //  $scope.tax = 7;
                $scope.tax = company.Tax;
            });
        });

        $scope.flag_status = [
            {"value": "open", "description": "Open"},
            {"value": "openSent", "description": "Open Sent"}
        ];


        $scope.currencies = [
            {"value": "USD", "description": "USD United States Dollar"}
        ];
        $scope.now = DateTimeService.nowIsoFormat();
        $scope.invoice = {};
        if (!_.isUndefined($stateParams.id)) {
            $scope.invoice = Invoice.$find($stateParams.id);
        } else {
            $scope.invoice = Invoice.$build();
            $scope.invoice.Currency = 'USD';
            $scope.invoice.Date = DateTimeService.nowIsoFormat();
            $scope.invoice.itemProducts.$build().$reveal();
            var invoiceNumber = Invoice.maxOrderNumber().success(function (response) {
                $scope.invoice.OrderNumber = response.max;
            });
        }

        $scope.BillShip = function () {
            if (!$scope.invoice.ShippingLocation)
                $scope.invoice.ShippingLocation = {};
            if (!$scope.invoice.BillingLocation)
                $scope.invoice.BillingLocation = {};
            if ($scope.invoice.BillShip) {
                var idLocation = (!_.isUndefined($scope.invoice.ShippingLocation)) ? $scope.invoice.ShippingLocation.Id : null;
                $scope.invoice.ShippingLocation = $scope.invoice.BillingLocation;
                $scope.invoice.ShippingLocation.Id = idLocation;
                angular.element('#shippingAddress').attr('readonly', true);
                angular.element('#shippingAddress1').attr('readonly', true);
                angular.element('#shippingCity').attr('readonly', true);
                angular.element('#shippingState').attr('readonly', true);
                angular.element('#shippingZipcode').attr('readonly', true);
            }
            else {
                $scope.invoice.BillingLocation =jQuery.extend({}, $scope.invoice.ShippingLocation);
                $scope.invoice.ShippingLocation.Address = '';
                $scope.invoice.ShippingLocation.Address1 = '';
                $scope.invoice.ShippingLocation.City = '';
                $scope.invoice.ShippingLocation.State = '';
                $scope.invoice.ShippingLocation.Zipcode = '';
                angular.element('#shippingAddress').attr('readonly', false);
                angular.element('#shippingAddress1').attr('readonly', false);
                angular.element('#shippingCity').attr('readonly', false);
                angular.element('#shippingState').attr('readonly', false);
                angular.element('#shippingZipcode').attr('readonly', false);
            }
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

        $scope.updateBillingShipping = function (customer) {
            customer.$fetch().$asPromise().then(function (customer) {
                if (customer.BillingLocation) {
                    var idLocation = (!_.isUndefined($scope.invoice.BillingLocation)) ? $scope.invoice.BillingLocation.Id : null;
                    $scope.invoice.BillingLocation = customer.BillingLocation;
                    $scope.invoice.BillingLocation.Id = idLocation;
                }
                if (customer.ShippingLocation) {
                    idLocation = (!_.isUndefined($scope.invoice.ShippingLocation)) ? $scope.invoice.ShippingLocation.Id : null;
                    $scope.invoice.ShippingLocation = customer.ShippingLocation;
                    $scope.invoice.ShippingLocation.Id = idLocation;
                }
            });

        }

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

        $scope.getAmount = function (item) {
            var quantity = (!isNaN(item.Quantity) && item.Quantity != "") ? parseInt(item.Quantity) : 0;
            var price = (!isNaN(item.Price) && item.Price != "") ? parseFloat(item.Price) : 0;
            var discount = (!isNaN(item.DiscountPrice) && item.DiscountPrice != "") ? parseFloat(item.DiscountPrice) : 0;
            return  ( quantity * price ) - ( quantity * price * discount / 100);
        }

        $scope.invoice.TotalTax = 7;
        $scope.getTotal = function (product) {
            var total = 0;
//            var tax = (!isNaN($scope.invoice.TotalTax) && $scope.invoice.TotalTax != "") ? parseInt($scope.invoice.TotalTax) : 7;

            var tax = (!isNaN($scope.invoice.TotalTax) && $scope.invoice.TotalTax != "") ? parseInt($scope.invoice.TotalTax) : 7;
            _.each($scope.invoice.itemProducts, function (item) {
                total += $scope.getAmount(item);
            })
            $scope.total = total;
            return  ( total) + ( total * tax / 100);
        }

        $scope.addItem = function (product, $index) {
            if (!_.isEmpty(product) && !_.isEmpty(product.Id)) {
                $scope.subtotal = 0;

                for (var i = 0; i < $scope.invoice.itemProducts.length; i++) {

                    if (!_.isEmpty($scope.invoice.itemProducts[i].Product.Id)) {
                        if ($scope.invoice.itemProducts[i].Product.Id == product.Id) {
                            toaster.pop('error', 'Error', 'The product has already been added');
                            return;
                        }
                    }
                }
                var item = {Product: product, Price: product.Price, DiscountPrice: product.DiscountPrice, Quantity: '1'};
                $scope.invoice.itemProducts[$index] = item;
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

        $scope.updateSubTotal = function () {
            $scope.subtotal = 0;
            $scope.total_amount = 0;
            if ($scope.invoice && $scope.invoice.itemProducts) {
                for (var i = 0; i < $scope.invoice.itemProducts.length; i++) {
                    $scope.subtotal += $scope.invoice.itemProducts[i].Quantity * $scope.invoice.itemProducts[i].Price;
                }
                $scope.total_tax = $scope.subtotal * $scope.tax / 100;
                $scope.total_amount = $scope.total_tax + $scope.subtotal;
            }
        };

        $scope.save = function () {
            //  $validation.validate($scope, 'invoice').success(function () {
            if ($scope.invoice.itemProducts.length > 0) {
                if (!_.isUndefined($scope.invoice.Id) && $scope.invoice.Id) {
                    $scope.invoice.Status = 'open';

                    /*Temporal hasta averiguar la fecha*/
                    /* $scope.invoice.Date = '0001-01-01T00:00:00Z';
                     $scope.invoice.DeliveryDate = '0001-01-01T00:00:00Z';*/

                    $scope.invoice.$save().$then(function (response) {
                        $rootScope.$broadcast('invoice::updated');
                        $rootScope.$broadcast('invoice::totalTab');
                        toaster.pop('success', 'Invoice Updated ', 'You have been successfully updated a invoice.')
                        $scope.$goTo($scope.step.list);
                    }, function () {
                        toaster.pop('error', 'Error', 'Something went wrong a new Invoice could not be created');
                    });
                } else {

                    var invoice = Invoice.$build();
                    invoice.Customer = {'Id': $scope.invoice.Customer.Id};
                    //invoice.CustomerShipping = {'Id': $scope.invoice.CustomerShipping.Id};
                    invoice.BillingLocation = $scope.invoice.BillingLocation;
                    invoice.ShippingLocation = $scope.invoice.ShippingLocation;
                    invoice.Date = $scope.invoice.Date;
                    // invoice.Date ='2015-02-25T00:19:09Z';
                    invoice.DeliveryInstruction = $scope.invoice.DeliveryInstruction;
                    invoice.DeliveryDate = $scope.invoice.DeliveryDate;

                    invoice.ReferenceNumber = $scope.invoice.ReferenceNumber;
                    invoice.Currency = $scope.invoice.Currency;
                    invoice.Emails = $scope.invoice.Emails;

                    invoice.Status = 'open';
                    invoice.Type = $scope.type;

                    invoice.InvoiceProducts = [];
                    var count = 0;
                    for (var i = 0; i < $scope.invoice.itemProducts.length; i++) {
                        if ($scope.invoice.itemProducts[i].Product.Name) {
                            invoice.InvoiceProducts[count] = $scope.invoice.itemProducts[i];
                            count++;
                        }
                    }
                    invoice.$save().$then(function (response) {
                        $rootScope.$broadcast('invoice::updated');
                        $rootScope.$broadcast('invoice::totalTab');
                        toaster.pop('success', 'Invoice Created', 'You have successfully created a new invoice.');
                        $state.go("app.sale");
                    }, function () {
                        toaster.pop('error', 'Error', 'Something went wrong a new Invoice could not be created');
                    });
                }
            } else
                toaster.pop('error', 'Error', 'The invoice must have at least one product.');
        };

    }]);