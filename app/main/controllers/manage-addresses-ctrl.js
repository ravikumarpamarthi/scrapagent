'use strict';
angular.module('main')
    .controller('Manage-addressesCtrl', function($scope, $ionicLoading, $state, $ionicPopup, profile) {
        $scope.shouldShowDelete = false;
        $scope.shouldShowReorder = false;
        $scope.listCanSwipe = true;
        $ionicLoading.show();
        $scope.getAddress = function() {
            profile.getAddress().then(function(res) {
                $ionicLoading.hide();
                $scope.locations = res.data.addresses;
            });
        }
        $scope.getAddress();
        $scope.go = function(state) {
            $state.go(state);
        }
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
        $scope.edit = function(location) {
            $state.go('main.edit-address', {
                id: location.addressId
            });
        }
    });
