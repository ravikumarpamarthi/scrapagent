'use strict';
angular.module('main')
    .controller('MenuCtrl', function($scope, $state, $cordovaNetwork, $ionicSideMenuDelegate, $global, $rootScope, $ionicPopup,$ionicLoading) {
        $scope.groups = [];
    for (var i = 0; i < 1; i++) {
        $scope.groups[i] = {
            name: i,
            items: []
        };
        for (var j = 0; j < 4; j++) {
            $scope.groups[i].items.push(i + '-' + j);
        }
    }

    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
    };

        $scope.go = function(state) {
            $state.go(state);
        }
        var myPopup = function() {
            $scope.offlinePopup = $ionicPopup.show({
                template: 'Check your data connection',
                title: 'Network Problem',
                buttons: [

                    {
                        text: '<b>Try Again</b>',
                        type: 'button-assertive',
                        onTap: function(e) {
                            if ($cordovaNetwork.isOnline()) {
                                $scope.offlinePopup.close();
                            } else {
                                e.preventDefault();
                            }
                        }
                    }
                ]
            });
        }
        $scope.authentication = $global.authentication;
        $rootScope.$on("initMenu", function() {
            $scope.authentication = $global.authentication;
        })

        $scope.menuClicked = function() {
            $scope.opened = true;

        };
        var badRequest = function() {
            $scope.badRequest = $ionicPopup.show({
                template: 'Unable to connect server',
                title: 'Server Error',
                buttons: [

                    {
                        text: '<b>Try Again</b>',
                        type: 'button-assertive',
                        onTap: function(e) {
                            $scope.badRequest.close();
                            $state.go($state.current, {}, {
                                reload: true
                            });
                        }
                    }
                ]
            });
        }
        var badGps = function() {
            $scope.badGps = $ionicPopup.show({
                template: 'Please Share your location',
                title: 'Geolocation Problem',
                buttons: [

                    {
                        text: '<b>Try Again</b>',
                        type: 'button-assertive',
                        onTap: function(e) {
                            $global.getCurrentLocation().then(function(latlng) {
                                $scope.badGps.close();
                            }, function(err) {

                            })
                        }
                    }
                ]
            });
        }
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
            if ($scope.offlinePopup) {
                $scope.offlinePopup.close();
                $state.go($state.current, {}, {
                    reload: true
                });
                $scope.offlinePopup = null;
            }
        })

        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
            if (!$scope.offlinePopup) {
                myPopup();
            }
        })
        $rootScope.$on('badRequest', function(event, networkState) {
            if (!$scope.badRequest) {
                badRequest();
            }
        })
        $rootScope.$on('badGps', function(event, networkState) {
            // badGps();
        })
        $rootScope.$on('invalidApiToken', function(event) {
            $global.showToastMessage('Your Session has expired please login again', 'short', 'center');
            $ionicLoading.hide();
            $state.go("main.login");
        })
    });
