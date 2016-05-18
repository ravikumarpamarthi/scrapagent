'use strict';
angular.module('main')
    .controller('UpdateSellItemsCtrl', function($scope, $filter, $stateParams, $global, ScrapCategories, sellRequests, $state, $ionicLoading, $ionicModal) {
        var id = $stateParams.id;
        $scope.paymentModes = $global.paymentModes;
        $ionicModal.fromTemplateUrl('main/templates/add-sell-items.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.addSellItemsModal = modal;
            $scope.openSellItemsModal();
        });
        sellRequests.getSellById(id).then(function(res) {
            $scope.sell = res.data.sell;
            $scope.data = prePareSellItemsObj(res.data.sell);
        }, function(err) {});
        $scope.openSellItemsModal = function() {
            $ionicLoading.show();
            ScrapCategories.getCategories().then(function(res) {
                if (res.status == $global.SUCCESS) {
                    $scope.categories = res.data.categories;
                    /*$scope.categories =[]; 
                    for (var i = categories.length - 1; i >= 0; i--) {
                        if(!checkSellItemIsAdded(categories[i].categoryId)){
                            $scope.categories.push(categories[i]);
                        }
                    };*/
                    $ionicLoading.hide();
                }
            }, function(error) {
                $ionicLoading.hide();
            });

            $scope.addSellItemsModal.show();
        };
        $scope.closeModal = function() {
            $scope.addSellItemsModal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.addSellItemsModal.remove();
        });
        $scope.removeSellItem = function(index) {
            $scope.data.items.splice(index, 1);
        }

        function prePareSellItemsObj(items) {
            if (!items.preferredPaymentMethod) {
                items.preferredPaymentMethod = $scope.paymentModes[0].value;
            }
            var obj = {
                'sellObjId': items.sellObjId,
                'agentObjId': items.agentObjId,
                'preferredPaymentMethod': items.preferredPaymentMethod,
                'items': [],
                'address':items.consumerAddress
            }
            for (var i = items.items.length - 1; i >= 0; i--) {
                var category = {
                    'categoryId': items.items[i].categoryId,
                    'categoryName': items.items[i].categoryName,
                    'image': items.items[i].image,
                    'pricePerUnit': items.items[i].pricePerUnit,
                    'quantity': items.items[i].quantity
                };
                obj.items.push(category);
            };
            return obj;
        }

        function checkSellItemIsAdded(categoryId) {
            return $filter('filter')($scope.data.items, {
                categoryId: categoryId
            })[0];
        }
        $scope.getTotoal = function() {
            var tot = 0;
            if ($scope.data && $scope.data.items)
                for (var i = $scope.data.items.length - 1; i >= 0; i--) {
                    tot = tot + parseFloat($scope.data.items[i].pricePerUnit * $scope.data.items[i].quantity);
                };
            return tot;
        }
        $scope.addItems = function() {
            var items = $scope.modaldata;
            for (var i = items.length - 1; i >= 0; i--) {
                if (items[i] && items[i].items && items[i].items.length > 0) {
                    var item = items[i].items[0];
                    var category = {
                        'categoryId': item.categoryId,
                        'categoryName': item.name,
                        'image': item.image,
                        'pricePerUnit': item.price,
                        'quantity': items[i].qty
                    };
                    if (!checkSellItemIsAdded(category.categoryId)) {
                        // $scope.categories.push(categories[i]);
                        $scope.data.items.push(category);
                    }

                }
            };
            $scope.modaldata = [];
            $scope.closeModal();
        }
        var shades = [1, 2, 5, 6, 9, 10, 13, 14, 17, 18, 21, 22, 25, 26, 29, 30, 33, 34, 37, 38, 41, 42];
        $scope.inShades = function(index) {
            return shades.indexOf(index) != -1
        }
        $scope.modaldata = [];
        $scope.modaldecreaseQty = function(index) {
            if ($scope.modaldata[index].qty > 1)
                $scope.modaldata[index].qty = parseInt($scope.modaldata[index].qty) - 1;
        }
        $scope.modalincreaseQty = function(index) {
            $scope.modaldata[index].qty = parseInt($scope.modaldata[index].qty) + 1;
        }


        $scope.decreaseQty = function(index) {
            if ($scope.data.items[index].quantity > 1)
                $scope.data.items[index].quantity = parseInt($scope.data.items[index].quantity) - 1;
        }
        $scope.increaseQty = function(index) {
            $scope.data.items[index].quantity = parseInt($scope.data.items[index].quantity) + 1;
        }
        $scope.decreasePrice = function(index) {
            if ($scope.data.items[index].pricePerUnit > 1)
                $scope.data.items[index].pricePerUnit = parseFloat($scope.data.items[index].pricePerUnit) - 1;
        }
        $scope.increasePrice = function(index) {
            $scope.data.items[index].pricePerUnit = parseFloat($scope.data.items[index].pricePerUnit) + 1;
        }

        $scope.updateSellItems = function() {
            $ionicLoading.show();
            sellRequests.updateSellItems($scope.data).then(function(res) {
                if (res.status == $global.SUCCESS) {
                    var obj = {
                        'sellObjId': $scope.data.sellObjId,
                        'agentObjId': $scope.data.agentObjId,
                    }
                    sellRequests.completeSellItems(obj).then(function(res) {
                        $state.go('main.sell-items-confirmation', {
                            id: $scope.sell.confirmationId
                        });
                        $ionicLoading.hide();
                    })

                } else if (res.status == $global.FAILURE) {
                    $global.showToastMessage(res.error.message, 'short', 'center');
                }

            })
        }
    });
