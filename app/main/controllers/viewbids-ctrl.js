'use strict';
angular.module('main')
.controller('ViewbidsCtrl', function ($scope, $global, $ionicModal, $ionicLoading,BidService,$timeout,$ionicPopup) {
        $scope.items=[1,2,3,4,5];
        $scope.shouldShowDelete = false;
        $scope.shouldShowReorder = false;
        $scope.listCanSwipe = true;
        $ionicLoading.show();
        $scope.getOpenBids=function(){
            BidService.getOpenBids().then(function(res){
                $ionicLoading.hide();
               if(res.status==$global.SUCCESS){
                $scope.bids=res.data.bids;
               }
            });
        }
        $scope.getOpenBids();
        
        $scope.showBid = function(id) {
            $scope.showBidModal.show();
        };

         $ionicModal.fromTemplateUrl('main/templates/bid-detail-modal.html', {
            scope: $scope,
            animation: 'mh-slide'
        }).then(function(modal) {
            $scope.showBidModal = modal
        });

        $scope.bidCloseModal = function() {
            $scope.showBidModal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.showBidModal.remove();
        });

        $scope.acceptBid = function(item,index) {
            var acceptBid = $ionicPopup.confirm({
                title: 'Alert',
                template: 'Do you want to accept bid?',
                okType: 'button-assertive'
            });
            acceptBid.then(function(res) {
                $ionicLoading.show();
                if (res) {
                    var obj = {
                        'bidId': item.bidObjId,
                        'categoryId': item.categoryId,
                        'agentId': $global.agentId,
                    }
                    BidService.acceptOpenBid(obj).then(function(res) {
                        $ionicLoading.hide();
                        if (res.status == $global.SUCCESS) {
                            $scope.bids.splice(index, 1);
                            $global.showToastMessage(res.data.message, 'short', 'center');
                    
                        }
                    })
                }
            });
        };

});
