'use strict';
angular.module('main')
    .service('$global', function(envService, localStorageService,$cordovaToast, $http, $q, $base64, $rootScope, $cordovaGeolocation,$ionicLoading) {
        this.defaultTimeout = 10000;
        this.SUCCESS = "SUCCESS";
        this.FAILURE = "FAILURE";
        this.feedBackChecked = false;
        this.setSellRequest = function(obj) {
            this.setLocalItem("sellReuestItems", obj, true);
            // this.sellRequestObj=obj;
        }
        this.getSellRequest = function() {
            var sellReuestItems = this.getLocalItem("sellReuestItems", true);
            return sellReuestItems;
        }
        this.showToastMessage=function(msg,duration,position){
              $cordovaToast.show(msg,duration, position);
        }
        this.setBadRequest = function() {
            $rootScope.$emit('badRequest', "ok");
        }
        this.invalidApiToken = function() {
            $rootScope.$emit('invalidApiToken', "ok");
        }
        this.init = function() {
            this.apiToken = "";
            this.authentication = null;
            this.agentId = null;
            var data = this.getLocalItem("authentication", true);
            if (data) {
                this.authentication = data.data;
                this.apiToken = data.data.apiToken;
                this.agentId = data.data.userId;
            }
        }
        this.objToQueryString = function(obj) {
            var k = Object.keys(obj);
            var s = "";
            for (var i = 0; i < k.length; i++) {
                s += k[i] + "=" + encodeURIComponent(obj[k[i]]);
                if (i != k.length - 1) s += "&";
            }
            return s;
        };

        this.apiUrl = envService.read("apiUrl");
        this.restApi = envService.read("restApi");

        this.setLanguage = function(lng) {
            localStorageService.set("lng", lng);
            this.translate();
        }
        this.setLocalItem = function(key, value, encoded) {
            value = JSON.stringify(value);
            if (encoded) {
                value = $base64.encode(value)
            }
            localStorageService.set(key, value);
        }
        this.removeLocalItem = function(key) {
            localStorageService.remove(key);
        }
        this.getLocalItem = function(key, decoded) {
            var value = localStorageService.get(key);
            value = (value) ? JSON.parse((decoded) ? $base64.decode(value) : value) : null;
            return value;
        }
        this.removeSellRequest = function() {
            this.removeLocalItem("sellReuestItems");
        }
        this.getLanguage = function() {
            localStorageService.get("lng");
        }

        this.paymentModes = [{
            name: "Cash",
            value: "Cash"
        }, {
            name: "Net Banking",
            value: "Net Banking"
        }, {
            name: "Credit Card",
            value: "Credit Card"
        }];

        this.getAuthorization = function() {
            var authorization = {
                'Authorization': 'Basic' + this.apiToken,
                'App-Id':'AGENT',
                'Client-Type':'MOBILE'
            }
            return authorization;
        }
        this.getLoginAuthorization = function(val) {
            val = $base64.encode(val);
            var authorization = {
                'Authorization': 'Basic' + val,
                'App-Id':'AGENT',
                'Client-Type':'MOBILE'
            }
            return authorization;
        }
        this.getApiUrl = function() {
            return this.apiUrl;
        }
        this.getApiObject = function() {
            return this.restApi;
        }

        this.getAddressObj = function(geolocation) {
            var address = {};
            var geometry = geolocation.geometry;
            address.latitude = geometry.location.lat();
            address.longitude = geometry.location.lng();
            for (var i = geolocation.address_components.length - 1; i >= 0; i--) {
                if (geolocation.address_components[i].types[0] == "locality") {
                    address.locality = geolocation.address_components[i].long_name;
                }
                if (geolocation.address_components[i].types[0] == "administrative_area_level_1") {
                    address.state = geolocation.address_components[i].long_name;
                }
                if (geolocation.address_components[i].types[0] == "country") {
                    address.country = geolocation.address_components[i].long_name;
                }
                if (geolocation.address_components[i].types[0] == "postal_code") {
                    address.postalCode = geolocation.address_components[i].long_name;
                }
            };

            return address;
        }
        this.getLocationByLatLng = function(latlng) {
            var deffered = $q.defer();
            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({
                'location': latlng
            }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    deffered.resolve(results[0]);
                } else {
                    deffered.reject("unable to find location");
                }
            });
            return deffered.promise;
        }

        this.getCurrentLocation = function() {
            var deffered = $q.defer();
            var options = {
                timeout: 10000,
                enableHighAccuracy: true
            };
            navigator.geolocation.getCurrentPosition(function(position) {
                var latlng = {
                    "lat": position.coords.latitude,
                    "lng": position.coords.longitude
                }
                deffered.resolve(latlng);
            }, function(error) {
                $ionicLoading.hide();
                // $rootScope.$emit('badGps', 'ok');
                 $cordovaToast.show('Unable get current location. Please type your location', 'short', 'center');
                  deffered.reject(error);
            }, options);
            return deffered.promise;
        }
        this.init();
        $rootScope.getImageFileById=this.getApiUrl() + this.getApiObject().getImageFileById;

    });
