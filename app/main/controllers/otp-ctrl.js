'use strict';
angular.module('main')
    .controller('OtpCtrl', function($scope, $state, authentication, profile, $global, $stateParams, $ionicLoading, $timeout) {
        $scope.data = $global.getLocalItem("registration", true);
        if (!$scope.data) {
            $scope.data = {};
            var mobileOrEmail = $global.getLocalItem("mobileOrEmail", true);
            $scope.data.mobileNo = mobileOrEmail;
        }
        $scope.authorization = {}
        $scope.$watch('data.otp', function(newVal, oldVal) {
            if (newVal && newVal.length == 6) {
                $scope.verify();
            }
        });

        $scope.verify = function() {
            $scope.errMessage = "";
            var verification = {};
            verification.mobileOrEmail = $scope.data.mobileNo;
            verification.verificationCode = $scope.data.otp;
            authentication.otpVerification(verification).then(function(res) {
                if (res.status && res.status == $global.SUCCESS) {
                    $global.setLocalItem("authentication", res, true);
                    $scope.authorization.otpkey = true;
                    $global.init();
                } else if (res.status == $global.FAILURE) {
                    $ionicLoading.hide();
                    $scope.errMessage = res.error.message || "Please enter valid OTP";
                }
            }, function(err) {

            })
        }

        $scope.submitOtpForm = function(form) {
            $scope.errMessage = "";
            var data = {
                newPassword: $scope.authorization.password
            }
            if (form.$valid) {
                $ionicLoading.show();
                profile.changePwd(data).then(function(res) {
                    if (res.status == $global.SUCCESS) {
                        $scope.successMessage = res.data.message;
                        // $global.showToastMessage(res.data.message, 'short', 'center');
                        if (mobileOrEmail) {
                            $state.go('main.home');
                        } else {
                            $state.go('main.myaccount');
                        }
                    } else if (res.status == $global.FAILURE) {
                        $scope.errorMessage = res.error.message;
                    }
                    $ionicLoading.hide();
                })
            }
        };
    });
