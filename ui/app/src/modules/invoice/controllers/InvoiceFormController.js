'use strict';

angular.module('invoice').controller('InvoiceFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Invoice', 'Country', 'State', 'Customer', 'Product', 'User', 'Company',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, Invoice, Country, State, Customer, Product, User, Company) {


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
            $scope.invoice.products.$build().$reveal();
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
                angular.element('#billingAddress').attr('readonly', true);
                angular.element('#billingAddress1').attr('readonly', true);
                angular.element('#billingCity').attr('readonly', true);
                angular.element('#billingState').attr('readonly', true);
                angular.element('#billingZipcode').attr('readonly', true);
            }
            else {
                $scope.invoice.ShippingLocation.Address = '';
                $scope.invoice.ShippingLocation.Address1 = '';
                $scope.invoice.ShippingLocation.City = '';
                $scope.invoice.ShippingLocation.State = '';
                $scope.invoice.ShippingLocation.Zipcode = '';
                angular.element('#billingAddress').attr('readonly', false);
                angular.element('#billingAddress1').attr('readonly', false);
                angular.element('#billingCity').attr('readonly', false);
                angular.element('#billingState').attr('readonly', false);
                angular.element('#billingZipcode').attr('readonly', false);
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
            $scope.invoice.products.$build().$reveal();
        }

        $scope.removeProduct = function (product) {
            $scope.invoice.products.$remove(product);
        }

        $scope.getAmount = function (product) {
            var quantity = (!isNaN(product.Quantity) && product.Quantity != "") ? parseInt(product.Quantity) : 0;
            var price = (!isNaN(product.Price) && product.Price != "") ? parseFloat(product.Price) : 0;
            var discount = (!isNaN(product.DiscountPrice) && product.DiscountPrice != "") ? parseFloat(product.DiscountPrice) : 0;
            return  ( quantity * price ) - ( quantity * price * discount / 100);
        }

        $scope.invoice.TotalTax = 7;
        $scope.getTotal = function (product) {
            console.log('ok');
            var total = 0;
//            var tax = (!isNaN($scope.invoice.TotalTax) && $scope.invoice.TotalTax != "") ? parseInt($scope.invoice.TotalTax) : 7;

            var tax = (!isNaN($scope.invoice.TotalTax) && $scope.invoice.TotalTax != "") ? parseInt($scope.invoice.TotalTax) : 7;
            _.each($scope.invoice.products, function (product) {
                total += $scope.getAmount(product);
            })
            $scope.total = total;
            return  ( total) + ( total * tax / 100);
        }

        $scope.addItem = function (product, $index) {
            if (!_.isEmpty(product) && !_.isEmpty(product.Id)) {
                $scope.subtotal = 0;

                for (var i = 0; i < $scope.invoice.products.length; i++) {

                    if (!_.isEmpty($scope.invoice.products[i].Id)) {
                        if ($scope.invoice.products[i].Id == product.Id) {
                            toaster.pop('error', 'Error', 'The product has already been added');
                            return;
                        }
                    }
                }
                var item = {Id: product.Id, Name: product.Name, Description: product.Description, Price: product.Price, DiscountPrice: product.DiscountPrice, Quantity: '1'};
                $scope.invoice.products[$index] = item;
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
            if ($scope.invoice && $scope.invoice.products) {
                for (var i = 0; i < $scope.invoice.products.length; i++) {
                    $scope.subtotal += $scope.invoice.products[i].Quantity * $scope.invoice.products[i].Price;
                }
                $scope.total_tax = $scope.subtotal * $scope.tax / 100;
                $scope.total_amount = $scope.total_tax + $scope.subtotal;
            }
        };

        $scope.save = function () {
            //  $validation.validate($scope, 'invoice').success(function () {
            if ($scope.invoice.products.length > 0) {
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

                    invoice.Status = 'open';
                    invoice.Type = $scope.type;

                    invoice.InvoiceProducts = [];
                    var count = 0;
                    for (var i = 0; i < $scope.invoice.products.length; i++) {
                        if ($scope.invoice.products[i].Name) {
                            invoice.InvoiceProducts[count] = $scope.invoice.products[i];
                            count++;
                        }

                    }
                    invoice.$save().$then(function (response) {
                        $rootScope.$broadcast('invoice::updated');
                        $rootScope.$broadcast('invoice::totalTab');
                        toaster.pop('success', 'Invoice Created', 'You have successfully created a new invoice.');
                        //  $scope.$goTo($scope.step.list);
                    }, function () {
                        toaster.pop('error', 'Error', 'Something went wrong a new Invoice could not be created');
                    });
                }
            } else
                toaster.pop('error', 'Error', 'The invoice must have at least one product.');
        };

    }]);