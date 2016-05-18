'use strict';
angular.module('main')
    .controller('LoginCtrl', function($scope, $global, authentication, $state, $ionicLoading, $timeout) {
        $scope.loginInfo = {};
        $scope.loginSubmit = function(form) {
            $scope.loginError = "";
            if (form.$valid) {
                $ionicLoading.show();
                authentication.login($scope.loginInfo).then(function(res) {
                    if (res.status == $global.SUCCESS) {
                        $global.setLocalItem("authentication", res, true);
                        $ionicLoading.hide();
                        $state.go("main.appointmentList");
                    } else if (res.status == $global.FAILURE) {
                        $ionicLoading.hide();
                        $scope.loginError = res.error.message;
                    }
                });
                $timeout(function(){
                  $ionicLoading.hide();
                },$global.defaultTimeout);
            }
        };
    });
