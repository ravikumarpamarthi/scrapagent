'use strict';
angular.module('main')
    .controller('Book-appointmentCtrl', function($scope, profile, $filter, $stateParams, $global, ScrapCategories, sellRequests, $state, $ionicLoading, $ionicModal) {
        var id = $stateParams.id;
        $scope.paymentModes = $global.paymentModes;
        $ionicModal.fromTemplateUrl('main/templates/add-sell-items.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.addSellItemsModal = modal;
            $scope.openSellItemsModal();
        });
        $scope.data = {
            'agentId': $global.agentId,
            'items': []
        }

        $scope.getAddress = function() {

            profile.getAddress().then(function(res) {
                $scope.locations = res.data.addresses;
                $scope.data.agentAddressId=$scope.locations[0].addressId
            });
        }
        $scope.getAddress();
        $scope.openSellItemsModal = function() {
            $ionicLoading.show();
            ScrapCategories.getCategories().then(function(res) {
                if (res.status == $global.SUCCESS) {
                    $scope.categories = res.data.categories;
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
                        'name': item.name,
                        'image': item.image,
                        'pricePerUnit': item.price,
                        'amount': item.price,
                        'quantity': items[i].qty
                    };
                    if (!checkSellItemIsAdded(category.categoryId)) {
                        $scope.data.items.push(category);
                    }

                }
            };
            if($scope.data.items.length==0){
        		$global.showToastMessage("Please add atleast one category", 'short', 'center');
        		return;
        	}
            $scope.modaldata = [];
            $scope.closeModal();
        }
        var shades = [1, 2, 5, 6, 9, 10, 13, 14, 17, 18, 21, 22, 25, 26, 29, 30, 33, 34, 37, 38, 41, 42];
        $scope.inShades = function(index) {
            return shades.indexOf(index) != -1
        }
        $scope.modaldata = [];
        $scope.modaldecreaseQty = function(index) {
            if ($scope.modaldata[index].qty > 1) {
                $scope.modaldata[index].qty = parseInt($scope.modaldata[index].qty) - 1;
            }
        }
        $scope.modalincreaseQty = function(index) {
            $scope.modaldata[index].qty = parseInt($scope.modaldata[index].qty) + 1;
        }

        function updateAmount(index){
        	$scope.data.items[index].amount = parseInt($scope.data.items[index].quantity)*parseFloat($scope.data.items[index].pricePerUnit);
               
        }
        $scope.decreaseQty = function(index) {
            if ($scope.data.items[index].quantity > 1) {
                $scope.data.items[index].quantity = parseInt($scope.data.items[index].quantity) - 1;
               updateAmount(index);
            
            }
        }
        $scope.increaseQty = function(index) {
            $scope.data.items[index].quantity = parseInt($scope.data.items[index].quantity) + 1;
             updateAmount(index);
        }
        $scope.decreasePrice = function(index) {
            if ($scope.data.items[index].pricePerUnit > 1)
                $scope.data.items[index].pricePerUnit = parseFloat($scope.data.items[index].pricePerUnit) - 1;
        }
        $scope.increasePrice = function(index) {
            $scope.data.items[index].pricePerUnit = parseFloat($scope.data.items[index].pricePerUnit) + 1;
        }

        $scope.updateSellItems = function() {
        	if(!$scope.data.agentAddressId){
        		$global.showToastMessage("Please Select Address", 'short', 'center');
        		return;
        	}if($scope.data.items.length==0){
        		$global.showToastMessage("Please add atleast one category", 'short', 'center');
        		return;
        	}
            $ionicLoading.show();
            sellRequests.bulksale($scope.data).then(function(res) {

                if (res.status == $global.SUCCESS) {
                    $ionicLoading.hide();
                    $global.showToastMessage(res.data.message, 'short', 'center');
                   $state.go('main.view-bulksales');
              
                } else if (res.status == $global.FAILURE) {
                    $ionicLoading.hide();
                    $global.showToastMessage(res.error.message, 'short', 'center');
                }

            })
        }

    });
