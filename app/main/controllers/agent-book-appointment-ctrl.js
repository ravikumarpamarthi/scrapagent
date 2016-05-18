'use strict';
angular.module('main')
.controller('Agent-book-appointmentCtrl', function ($scope, $global, $moment, NgMap, SellNow, profile, $state, $timeout, $ionicLoading) {

  $global.removeSellRequest();
        /*date picker */
        var disabledDates = [];
        var monthList = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        $scope.datepickerObject = {};
        $scope.datepickerObject.inputDate = new Date();
        $scope.datepickerObjectPopup = {
            titleLabel: 'Select Date', //Optional
            todayLabel: 'Today', //Optional
            closeLabel: 'Close', //Optional
            setLabel: 'Set', //Optional
            errorMsgLabel: 'Please select time.', //Optional
            setButtonType: 'button-assertive', //Optional
            modalHeaderColor: 'bar-positive', //Optional
            modalFooterColor: 'bar-positive', //Optional
            templateType: 'popup', //Optional
            inputDate: $scope.datepickerObject.inputDate, //Optional
            mondayFirst: false, //Optional
            // disabledDates: disabledDates, //Optional
            monthList: monthList, //Optional
            from: new Date(), //Optional
            callback: function(val) { //Optional
                datePickerCallbackPopup(val);
            }
        };

        var datePickerCallbackPopup = function(val) {
            if (typeof(val) === 'undefined') {} else {
                $scope.datepickerObjectPopup.inputDate = val;
            }
        };
        /*date picker end */
        var map;
        NgMap.getMap().then(function(evtMap) {
            map = evtMap;
        });
        $scope.maps = [];
        $scope.$on('mapInitialized', function(evt, evtMap) {
            $scope.maps.push(evtMap);
        });
        $scope.reRednerMap = function() {
            $timeout(function() {
                angular.forEach($scope.maps, function(map) {
                    // google.maps.setCenter($scope.center);
                    var currCenter = map.getCenter();
                    google.maps.event.trigger(map, 'resize');
                    map.setCenter(currCenter);
                });
            }, 500);
        }
        var geocoder = new google.maps.Geocoder;
        $scope.vm = {};
        $scope.disableTap = function() {
            var container = document.getElementsByClassName('pac-container');
            angular.element(container).attr('data-tap-disabled', 'true');
            angular.element(container).on("click", function() {
                document.getElementById('autocomplete').blur();
            });
        }

        var sellRequestObj = $global.getSellRequest();
        if (!sellRequestObj) {
            $state.go("main.dashboard");
            return;
        };
        SellNow.getSlots().then(function(res) {
            $scope.slots = res.data.slots;
            $scope.data.preferredSlot = $scope.slots[0].name;
        })
        $ionicLoading.show();
        profile.getAddress().then(function(res) {
            $scope.locations = res.data.addresses;
            if ($scope.locations[0] && $scope.locations[0].defaultAddress == 'YES') {
                $scope.selectedItem = $scope.locations[0];
                $scope.setMap($scope.selectedItem)
            } else {
                $scope.center = "current-location";
            }
            $scope.reRednerMap();
            $ionicLoading.hide();
        });
        $scope.data = {
            "consumerId": $global.consumerId,
            "items": []
        };
        for (var i = sellRequestObj.length - 1; i >= 0; i--) {
            var item = {};
            if (sellRequestObj[i].items && sellRequestObj[i].items.length > 0) {
                item.categoryId = sellRequestObj[i].items[0].categoryId;
                item.categoryName = sellRequestObj[i].items[0].name;
                item.quantity = sellRequestObj[i].qty;

                $scope.data.items.push(item);
            }
        };
        $scope.placeChanged = function() {
            console.log(this.getPlace());
            $scope.place = this.getPlace();
            var obj = {};
            obj.lat = $scope.place.geometry.location.lat();
            obj.lng = $scope.place.geometry.location.lng();
            $scope.setLocation(obj);
            // $scope.placeError=false;

        }
        $scope.sellNow = function(drop) {

            if (!$scope.place && !$scope.data.consumerAddressId) {

                $scope.placeError = true;
            } else {
                $ionicLoading.show();
                if (drop == 'DROP') {
                    $scope.data.agentId = $scope.drop.agentId.userId;
                    $scope.data.agentAddressId = $scope.drop.agentId.addressId;
                }
                $scope.data.preferredDate = $moment($scope.datepickerObjectPopup.inputDate).format('DD-MMM-YYYY');
                if ($scope.place) {
                    var address = $global.getAddressObj($scope.place);
                    address.userId = $global.consumerId;
                    address.userType = "CONSUMER";
                    address.formattedAddress = $scope.vm.formattedAddress;
                    profile.saveCosumerAddress(address).then(function(res) {
                        $scope.data.consumerAddressId = res.data.address.addressId;
                        SellNow.sellNow($scope.data, drop).then(function(res) {
                            if (res.status == $global.SUCCESS) {
                                $state.go("main.sellconfirm", {
                                    id: res.data.confirmationId
                                });
                            } else if (res.status == $global.FAILURE) {
                                $ionicLoading.hide();
                                $scope.errorMessage = res.error.message;
                            }
                        })
                    })
                } else {
                    SellNow.sellNow($scope.data, drop).then(function(res) {
                        if (res.status == $global.SUCCESS) {
                            $state.go("main.sellconfirm", {
                                id: res.data.confirmationId
                            });
                        } else if (res.status == $global.FAILURE) {
                            $ionicLoading.hide();
                            $scope.errorMessage = res.error.message;
                        }
                    })
                }
            }

        }
        $scope.drop = {};

        function getAgents(obj) {
            $scope.drop.agentId = {};
            SellNow.getAgents(obj.lat, obj.lng).then(function(res) {
                $scope.agents = res.data.addresses;
            })
        }
        $scope.setMap = function(location, drop) {

            if (location) {
                var obj = {};
                $scope.data.consumerAddressId = location.addressId;
                obj.lat = location.latitude;
                obj.lng = location.longitude;
                if (drop) {
                    getAgents(obj);
                }
                $scope.setLocation(obj);
                $scope.placeError = false;
            } else {
                $scope.placeError = true;
                $scope.data.consumerAddressId = null;
            }
        }
        $scope.setLocation = function(obj) {
            var center = [];
            center.push(obj.lat);
            center.push(obj.lng);
            $scope.center = center.join();
            $scope.positions = [{
                pos: center
            }];
        }

        function setPlaceObject(latlng) {
            $global.getLocationByLatLng(latlng).then(function(res) {
                $scope.place = res;
                $scope.vm.formattedAddress = res.formatted_address;

            })
        }
        $scope.setCurrentLocation = function() {
            $global.getCurrentLocation().then(function(latlng) {
                $scope.center = latlng.lat + "," + latlng.lng;
                $scope.reRednerMap();
                setPlaceObject(latlng)
            })
        }
        $scope.markerDragEnd = function(event) {
            $timeout(function() {
                var latlng = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                };
                setPlaceObject(latlng);
                $scope.center = latlng.lat + "," + latlng.lng;
            })
        }


});
