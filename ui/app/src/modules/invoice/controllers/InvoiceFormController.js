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

        /*    $scope.countries = Country.$search();
         $scope.states = State.$search();*/
        $scope.now = DateTimeService.nowIsoFormat();

        $scope.BillShip = function () {
            if ($scope.invoice.BillShip) {
                $scope.invoice.CustomerShipping = $scope.invoice.Customer;
                angular.element('#CustomerShipping').attr('readonly', true);
            }
            else {
                $scope.invoice.CustomerShipping = '';
                angular.element('#CustomerShipping').attr('readonly', false);
            }

        };

        // TODO: implement Invoice.getMaxOrderNumber()
        //   $scope.invoiceNumber = 500;
        $scope.searchCustomers = function (val) {
            return Customer.$search({keyword: val, page: 1, order: 'notSorting'}).$asPromise().then(function (customers) {
                return customers;
            });
        };

        $scope.searchProducts = function (val) {
            return Product.$search({keyword: val, page: 1, order: 'notSorting'}).$asPromise().then(function (products) {
                return products;
            });
        };

        $scope.addItem = function (item_input) {
            if (!_.isEmpty(item_input) && !_.isEmpty(item_input.Id)) {
                $scope.subtotal = 0;
                // item_input.quantity = 1;
                for (var i = 0; i < $scope.invoice.items.length; i++) {
                    if ($scope.invoice.items[i].Product.Id == item_input.Id) {
                        toaster.pop('error', 'Error', 'The product has already been added');
                        return;
                    }
                }
                var item = {Product: item_input, Price: item_input.Price, Quantity: 1};
                $scope.invoice.items[$scope.invoice.items.length] = item;
                $scope.item_input = '';
            } else
                toaster.pop('error', 'Error', 'Select an item');
        };

        /*
         $scope.saveQuantity = function (item) {
         if (item.product.stock < item.quantity)
         toaster.pop('error', 'Error', 'The maximum quantity in stock is ' + item.product.stock);
         };
         */
        $scope.removeItem = function (item) {
            if (!_.isEmpty(item)) {
                for (var i = 0; i < $scope.invoice.items.length; i++) {
                    if ($scope.invoice.items[i].id == item.id) {
                        $scope.invoice.items.splice(i, 1);
                    }
                }
            }
        };

        $scope.updateSubTotal = function () {
            $scope.subtotal = 0;
            $scope.total_amount = 0;
            if ($scope.invoice && $scope.invoice.items) {
                for (var i = 0; i < $scope.invoice.items.length; i++) {
                    $scope.subtotal += $scope.invoice.items[i].Quantity * $scope.invoice.items[i].Price;
                }
                $scope.total_tax = $scope.subtotal * $scope.tax / 100;
                $scope.total_amount = $scope.total_tax + $scope.subtotal;
            }
        };


        $scope.$watch($scope.updateSubTotal);
        $scope.reset = function () {
            $scope.item_input="";
        }
        $scope.save = function (status) {
            //  $validation.validate($scope, 'invoice').success(function () {
            if ($scope.invoice.items.length > 0) {
                if (!_.isUndefined($scope.invoice.Id) && $scope.invoice.Id) {
                    $scope.invoice.status = status;

                    $scope.invoice.$update({id: $scope.invoice.Id}, function (response) {
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
                   // invoice.Date = $scope.invoice.Date;
                    invoice.DeliveryInstruction = $scope.invoice.DeliveryInstruction;
                  //  invoice.DeliveryDate = $scope.invoice.DeliveryDate;

                    invoice.ReferenceNumber = $scope.invoice.ReferenceNumber;
                    invoice.Currency = $scope.invoice.Currency.value;
                    invoice.InvoiceProducts = $scope.invoice.items;
                    invoice.Status = status;

                    invoice.$save().$then(function (response) {
                    //    $rootScope.$broadcast('invoice::updated');
                     //   $rootScope.$broadcast('invoice::totalTab');
                        toaster.pop('success', 'Invoice Created', 'You have successfully created a new invoice.');
                      //  $scope.$goTo($scope.step.list);
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