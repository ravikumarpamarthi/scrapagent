'use strict';
angular.module('main')
.controller('CatSelectionCtrl', function ($scope, $state, $global,profile) {
       $scope.userCategories=[];
       
		    profile.userCategories().then(function(res){
            if(res.status == "SUCCESS"){
               $scope.catList=res.data.categories;
            } else if (res.status == "FAILURE") {
               $scope.errMessage=res.error.message;
            }
            
        });
        profile.getProfile().then(function(res){
            $scope.data=res.data.consumer;
        })
	$scope.submitCatSelectionForm = function(list) {
        $scope.data.categories=list;
        profile.updateProfile($scope.data).then(function(res){
          if (res.status == "SUCCESS") {
                         $state.go('main.myaccount');
                    } else if (res.status == "failure") {
                        $scope.errMessage=res.error.message;
                    }
           
        })
		
  	};
});
