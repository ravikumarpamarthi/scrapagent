'use strict';
angular.module('main')
.controller('ViewBulksalesCtrl', function ($scope,sellRequests,$ionicModal, $global, $ionicPopup, $ionicLoading) {
  sellRequests.getBulkSales().then(function(res){
  	$scope.sells=res.data.sales;
  })

});
