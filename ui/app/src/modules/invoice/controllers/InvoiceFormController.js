'use strict';

angular.module('invoice').controller('InvoiceFormController', ['$scope', '$rootScope', '$stateParams', 'config', '$modal', 'dialogs', 'DateTimeService', 'toaster', '$validation', 'Invoice', 'Country', 'State', 'Customer', 'Product', 'User', 'Company',
    function ($scope, $rootScope, $stateParams, config, $modal, dialogs, DateTimeService, toaster, $validation, Invoice, Country, State, Customer, Product, User, Company) {


        User.$find(User.getCurrentUserId()).$asPromise().then(function (user) {
            Company.$find(user.Company.Id).$asPromise().then(function (company) {
                $scope.tax = company.Tax;
            });
        });


        $scope.currencies = [
            {"value": "USD", "description": "USD United States Dollar"}
        ];
        $scope.now = DateTimeService.nowIsoFormat();
        $scope.invoice = {};
        if(!_.isUndefined($stateParams.id)){
            $scope.invoice = Invoice.$find($stateParams.id);
        }else{
            $scope.invoice = Invoice.$build();
            $scope.invoice.products.$build().$reveal();
        }

        $scope.BillShip = function () {
            if ($scope.invoice.BillShip) {
                $scope.invoice.CustomerShipping = $scope.invoice.Customer;
                angular.element('#CustomerShipping').attr('readonly', true);
            }
            else {
                $scope.invoice.CustomerShipping = '';
                angular.element('#CustomerShipping').attr('readonly', false);
            }
        }


        // TODO: implement Invoice.getMaxOrderNumber()
        //   $scope.invoiceNumber = 500;
        $scope.searchCustomers = function (val) {
            return Customer.$search({keyword: val, page: 1, order: 'notSorting'}).$asPromise().then(function (customers) {
                if(customers == null)
                return {};
                else
                return customers;
            });
        };

        $scope.searchProducts = function (val) {
            return Product.$search({keyword: val, page: 1, order: 'notSorting'}).$asPromise().then(function (products) {
                return products;
            });
        };

        $scope.addProduct = function(index){
            if(index == $scope.invoice.products.length - 1)
                $scope.invoice.products.$build().$reveal();
        }

        $scope.removeProduct = function(product){
            $scope.invoice.products.$remove(product);
        }

        $scope.getAmount = function(product){
            var quantity = (!isNaN(product.QuantitySolicited) && product.QuantitySolicited != "") ? parseInt(product.QuantitySolicited) : 0;
            var price = (!isNaN(product.Price) && product.Price != "") ? parseFloat(product.Price) : 0;
            var discount = (!isNaN(product.DiscountPrice) && product.DiscountPrice != "") ? parseFloat(product.DiscountPrice) : 0;
            return  ( quantity * price ) - ( quantity * price * discount / 100);
        }

        $scope.getTotal = function(product){
            var total = 0;
            var tax = (!isNaN($scope.invoice.TotalTax) && $scope.invoice.TotalTax != "") ? parseInt($scope.invoice.TotalTax) : 0;
            _.each($scope.invoice.products,function(product){
                total += $scope.getAmount(product);
            })
            $scope.total = total;
            return  ( total) + ( total * tax / 100);
        }

//        $scope.addItem = function (item_input) {
//            if (!_.isEmpty(item_input) && !_.isEmpty(item_input.Id)) {
//                $scope.subtotal = 0;
//                // item_input.quantity = 1;
//                for (var i = 0; i < $scope.invoice.InvoiceProducts.length; i++) {
//                    if ($scope.invoice.InvoiceProducts[i].Product.Id == item_input.Id) {
//                        toaster.pop('error', 'Error', 'The product has already been added');
//                        return;
//                    }
//                }
//                var item = {Product: item_input, Price: item_input.Price, Quantity: '1'};
//                $scope.invoice.InvoiceProducts[$scope.invoice.InvoiceProducts.length] = item;
//                $scope.item_input = '';
//            } else
//                toaster.pop('error', 'Error', 'Select an item');
//        };

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
            if ($scope.invoice && $scope.invoice.InvoiceProducts) {
                for (var i = 0; i < $scope.invoice.InvoiceProducts.length; i++) {
                    $scope.subtotal += $scope.invoice.InvoiceProducts[i].Quantity * $scope.invoice.InvoiceProducts[i].Price;
                }
                $scope.total_tax = $scope.subtotal * $scope.tax / 100;
                $scope.total_amount = $scope.total_tax + $scope.subtotal;
            }
        };


        $scope.save = function (status) {
            //  $validation.validate($scope, 'invoice').success(function () {
            console.log(status);
            if ($scope.invoice.InvoiceProducts.length > 0) {
                if (!_.isUndefined($scope.invoice.Id) && $scope.invoice.Id) {
                    $scope.invoice.Status = status;

                    /*Temporal hasta averiguar la fecha*/
                    /* $scope.invoice.Date = '0001-01-01T00:00:00Z';
                     $scope.invoice.DeliveryDate = '0001-01-01T00:00:00Z';*/

                    $scope.invoice.$save().$then(function(response) {
                        $rootScope.$broadcast('invoice::updated');
                        $rootScope.$broadcast('invoice::totalTab');
                        toaster.pop('success', 'Invoice Updated ', 'You have been successfully updated a invoice.')
                        $scope.$goTo($scope.step.list);
                    }, function () {
                        toaster.pop('error', 'Error', 'Something went wrong a new Invoice could not be created');
                    });
                } else {

                    var invoice = Invoice.$build();
                    invoice.Customer = {'Id':$scope.invoice.Customer.Id};
                    invoice.CustomerShipping = {'Id':$scope.invoice.CustomerShipping.Id};
                    invoice.Date = $scope.invoice.Date;
                   // invoice.Date ='2015-02-25T00:19:09Z';
                    invoice.DeliveryInstruction = $scope.invoice.DeliveryInstruction;
                    invoice.DeliveryDate =$scope.invoice.DeliveryDate;

                    invoice.ReferenceNumber = $scope.invoice.ReferenceNumber;
                    invoice.Currency = $scope.invoice.Currency;
                    invoice.InvoiceProducts = $scope.invoice.InvoiceProducts;
                    invoice.Status = status;

                    invoice.$save().$then(function (response) {
                        $rootScope.$broadcast('invoice::updated');
                        $rootScope.$broadcast('invoice::totalTab');
                        toaster.pop('success', 'Invoice Created', 'You have successfully created a new invoice.');
                        $scope.$goTo($scope.step.list);
                    }, function () {
                        toaster.pop('error', 'Error', 'Something went wrong a new Invoice could not be created');
                    });
                }
            } else
                toaster.pop('error', 'Error', 'The invoice must have at least one product.');
            //   }).error(function () {
            //       toaster.pop('error', 'Error', 'Complete the required entry fields.');
            //    });
        };

        function deshabilitar(valor) {
            angular.forEach(
                angular.element('#form_invoice .form-control'),
                function (inputElem) {
                    angular.element(inputElem).attr('readonly', valor);
                });
            angular.forEach(
                angular.element('date-time-picker'),
                function (inputElem) {
                    angular.element(inputElem).attr('readonly', valor);
                });
            $scope.visible = false;
        }

    }]);