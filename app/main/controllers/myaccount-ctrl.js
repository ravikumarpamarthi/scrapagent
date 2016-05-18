'use strict';
angular.module('main')
    .controller('MyAccountCtrl', function($scope, $state, $cordovaDevice, $global, profile, $ionicModal, $ionicPopup, $ionicLoading, $timeout) {
        $ionicLoading.show();
        $scope.data = {};
        $scope.myAccountForm = {};

        $scope.userCategories = [];
        $scope.userAddresses = [];
        $scope.init = false;
        $scope.editForm = {};
        $scope.edit = function(key) {
            $scope.editForm[key] = true;
        }

        function init() {
            profile.getProfile().then(function(res) {
                
                if (res.status == $global.SUCCESS) {
                    $scope.profileData = res.data.agent;
                     if (res.data.agent && res.data.agent.address) {
                        $scope.data.defaultLocation = res.data.agent.address
                    } else {
                        $scope.data.defaultLocation = null;
                    }
                    $scope.init = true;
                } else if (res.status == $global.FAILURE) {
                    $state.go("main.login")
                }
                $ionicLoading.hide();
            }, function(err) {
                $ionicLoading.hide();
            });
        }
        init();
        

        $ionicModal.fromTemplateUrl('main/templates/addresses-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.addressesModal = modal
        });

        $ionicModal.fromTemplateUrl('main/templates/addresses-delete-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.addressesModalForDelete = modal
        });


        $scope.getAddress = function() {

            profile.getAddress().then(function(res) {
                $ionicLoading.hide();
                $scope.locations = res.data.addresses;
            });
        }
        $scope.showAddresses = function() {
            $ionicLoading.show();
            $scope.getAddress();
            $scope.addressesModal.show();
        };

        $scope.showAddressesForDelete = function() {
            $ionicLoading.show();
            profile.getAddress().then(function(res) {
                $ionicLoading.hide();
                $scope.locations = res.data.addresses;
            });
            $scope.addressesModalForDelete.show();
        };

        $scope.addressesCloseModal = function() {
            $scope.addressesModal.hide();
        };
        $scope.ManageAddresses = function() {
            $state.go('main.manage-address');
        };

        $scope.addressesToDeleteCloseModal = function() {
            init();
            $scope.addressesModalForDelete.hide();
        };


        $scope.confirmDelete = function(location) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Alert',
                template: 'Do you want to delete Address?',
                okType: 'button-default',
                okText: 'Yes',
                cancelText: 'No',
                cancelType: 'button-assertive'

            });
            confirmPopup.then(function(res) {
                if (res) {
                    profile.deleteAddres(location.addressId).then(function(res) {
                        $scope.getAddress();
                    })
                } else {}
            });
        };

        function setDefaultAdd() {
            profile.setDefaultAdd($scope.data.defaultLocation.addressId).then(function(res) {})
        }
        $scope.sub = function(profileData, myAccountForm) {
            

            if (!$scope.data.defaultLocation || !$scope.data.defaultLocation.addressId) {
                $scope.noLocationError = "Please add atleast one location";
                return;
            }
           
            if (myAccountForm.$valid) {
                $ionicLoading.show();
                setDefaultAdd();
                $scope.prodata = angular.copy($scope.profileData);
                delete $scope.prodata.address;
                profile.updateProfile($scope.prodata).then(function(res) {
                    $ionicLoading.hide();
                    if (res.status == $global.FAILURE) {
                        $scope[res.error.code] = res.error.message;
                    } else if (res.status == $global.SUCCESS) {
                        $state.go('main.home');
                    }

                }, function(err) {
                    $ionicLoading.hide();

                });
            }
            return;

        };

        $scope.focus = function(id) {

            $timeout(function() {
                document.getElementById(id).focus();
                if (ionic.Platform.isAndroid()) {
                    cordova.plugins.Keyboard.show();
                }
            }, 0);
        }
    });
