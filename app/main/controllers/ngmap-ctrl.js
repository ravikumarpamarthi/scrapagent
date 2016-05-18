'use strict';
angular.module('main')
    .controller('NgmapCtrl', function($scope, $state, $stateParams, $global, commonSevices, sellRequests, profile, NgMap, $ionicLoading, $timeout, $cordovaCamera, $cordovaFileTransfer) {
        $scope.data = [];
        $scope.positions = [];
        var location = {};
        var map;
        NgMap.getMap().then(function(evtMap) {
            map = evtMap;
        });
        $ionicLoading.show();
        $scope.go = function(state) {
            $state.go(state);
        }
        function setPlaceObject(latlng) {
            $global.getLocationByLatLng(latlng).then(function(res) {
                $scope.place = res;
                $scope.vm.formattedAddress = res.formatted_address;

            })
        }

        function reRednerMap() {
            $timeout(function() {
                if(!map)
                    return;
                var currCenter = map.getCenter();
                google.maps.event.trigger(map, 'resize');

                map.setCenter(currCenter);
            }, 500);
        }

        $scope.setCurrentLocation = function() {
            $global.getCurrentLocation().then(function(latlng) {
                $scope.center = latlng.lat + "," + latlng.lng;
                setPlaceObject(latlng);
                reRednerMap();
                $ionicLoading.hide();
            })
        }
        if ($stateParams.id) {
            commonSevices.getAddress($stateParams.id).then(function(res) {
                var address = res.data.address;
                $scope.shopImage = address.shopImage;
                $scope.addressId = address.addressId;
                var latlng = {
                    lat: parseFloat(address.latitude),
                    lng: parseFloat(address.longitude)
                };
                setPlaceObject(latlng);
                $scope.setLocation(latlng);
                $ionicLoading.hide();
            })
        } else {
            $scope.setCurrentLocation();
        }
        $scope.disableTap = function() {
            var container = document.getElementsByClassName('pac-container');
            angular.element(container).attr('data-tap-disabled', 'true');
            angular.element(container).on("click", function() {
                document.getElementById('autocomplete').blur();
            });
        }

        $scope.placeChanged = function() {
            $scope.place = this.getPlace();
            var obj = {};
            obj.lat = $scope.place.geometry.location.lat();
            obj.lng = $scope.place.geometry.location.lng();
            $scope.setLocation(obj);
        }

        $scope.setLocation = function(obj) {

            var center = [];
            center.push(obj.lat);
            center.push(obj.lng);
            $scope.center = center.join();
        }
        $scope.vm = {};

        function saveLocation(fileId) {
            $ionicLoading.show();
            var address = $global.getAddressObj($scope.place);
            address.userId = $global.agentId;
            if ($scope.addressId) {
                address.addressId = $scope.addressId;
            }
            if ($scope.shopImage) {
                address.shopImage = $scope.shopImage;
            }
            if (fileId) {
                address.shopImage = fileId;
            }
            address.userType = "AGENT";
            address.formattedAddress = $scope.vm.formattedAddress;
            if ($scope.addressId) {
                profile.updateaddress(address).then(function(res) {
                    $ionicLoading.hide();
                    $scope.data.addressId = res.data.address.addressId;
                    $state.go('main.myaccount');

                })
            } else {

                profile.saveCosumerAddress(address).then(function(res) {
                    $ionicLoading.hide();
                    $scope.data.addressId = res.data.address.addressId;
                    $state.go('main.myaccount');

                })
            }
        }
        $scope.addLocation = function(file) {
            if (!$scope.place || !$scope.vm.formattedAddress) {
                $scope.errorMessage = true;
                return;
            }
            if ($scope.picData) {
                var fileURL = $scope.picData;
                var options = new FileUploadOptions();
                var url = $global.getApiUrl() + $global.getApiObject().uploadFile;
                options.fileKey = "file";
                options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = true;
                $cordovaFileTransfer.upload(url, fileURL, options)
                    .then(function(res) {
                        res = JSON.parse(res.response)
                        var fileId = res.data.fileId
                        saveLocation(fileId);
                    }, function(err) {
                        // Error
                    }, function(progress) {
                        // constant progress updates
                    });
                /* commonSevices.uploadFile(file).then(function(res) {
                     var fileId = res.data.fileId
                     saveLocation(fileId);
                 }, function(err) {

                 }, function(evt) {
                     console.log(evt);
                     $scope.progress = parseInt(100.0 * evt.loaded / evt.total)
                 });*/
            } else {
                saveLocation();
            }

            
        };

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

        $scope.takePicture = function() {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.CAMERA
            };
            $cordovaCamera.getPicture(options).then(
                function(imageData) {
                    $scope.picData = imageData;
                    $ionicLoading.show({
                        template: 'loading...',
                        duration: 500
                    });
                },
                function(err) {
                    $ionicLoading.show({
                        template: 'Error to load.. ',
                        duration: 500
                    });
                })
        }

        $scope.selectPicture = function() {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
            };

            $cordovaCamera.getPicture(options).then(
                function(imageData) {
                    $scope.picData = imageData;
                    $ionicLoading.show({
                        template: 'loading...',
                        duration: 500
                    });
                },
                function(err) {
                    $ionicLoading.show({
                        template: 'Error to load image...',
                        duration: 500
                    });
                })
        };
    });
