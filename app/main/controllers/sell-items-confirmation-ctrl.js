'use strict';
angular.module('main')
    .controller('SellItemsConfirmationCtrl', function($scope, $ionicLoading,$state, $stateParams, sellRequests) {

        var id = $stateParams.id;

        function init() {
            $ionicLoading.show();
            sellRequests.getSellById(id).then(function(res) {
                $scope.sellDetails = res.data.sell;
                $ionicLoading.hide();
            }, function(err) {
                $ionicLoading.hide();
            });

        }
        init();

        $scope.complete = function() {
            $state.go('main.appointmentList')
            /*var obj = {
                'sellObjId': $scope.sellDetails.sellObjId,
                'agentObjId': $scope.sellDetails.agentObjId,
            }
            sellRequests.completeSellItems(obj).then(function(res) {
                init();
            })*/
        }
        $scope.edit = function() {
            $state.go('main.update-sell-items', {
                id: id
            })
        }

    });
