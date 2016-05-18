'use strict';
angular.module('main')
    .factory('httpService', function($http, $q, $global, Upload, $ionicLoading) {
         function setToastMessage(res){
            $global.showToastMessage(res.error.message, 'short', 'center');
        }
        return {
            httpJsonp: function(url) {
                var deffered = $q.defer();
                $http.jsonp(url, {
                        headers: $global.getAuthorization()
                    })
                    .success(function(data) {
                        deffered.resolve(data);
                    }).error(function(error) {
                        deffered.reject(error);
                    });
                return deffered.promise;
            },
            httpLogin: function(url, header) {
                var deffered = $q.defer();
                $http.post(url, "", {
                    headers: header
                }).success(function(res) {
                    if (res.error && res.error.code && res.error.code == "EC_INVALID_APITOKEN") {
                        $global.invalidApiToken();
                        deffered.reject(res);
                    } else {
                        if (res.error && res.error.message) {
                           setToastMessage(res)
                        }
                        deffered.resolve(res);
                    }
                }, {
                    'Content-Type': 'application/json;charset=UTF-8'
                }).error(function(error) {
                    $ionicLoading.hide();
                    $global.setBadRequest();
                    deffered.reject(error);;
                });
                return deffered.promise;
            },
            uploadRequest: function(url, file) {
                var deffered = $q.defer();
                Upload.upload({
                    url: url,
                    file: file,
                    headers: $global.getAuthorization()
                }).then(function(res) {
                    deffered.resolve(res.data);
                }, function(error) {
                    deffered.reject(error);
                });
                return deffered.promise;
            },
            httpRequest: function(url, method, data) {
                var deffered = $q.defer();
                if (method == 'P') {
                    $http.post(url, data, {
                        headers: $global.getAuthorization()
                    }).success(function(res) {
                        if (res.error && res.error.code && res.error.code == "EC_INVALID_APITOKEN") {
                            $global.invalidApiToken();
                            deffered.reject(res);
                        } else {
                            if (res.error && res.error.message) {
                              setToastMessage(res)
                            }
                            deffered.resolve(res);
                        }
                    }).error(function(error) {
                        $ionicLoading.hide();
                        $global.setBadRequest();
                        deffered.reject(error);;
                    });

                }
                if (method == 'PU') {
                    $http.put(url, data, {
                        headers: $global.getAuthorization()
                    }).success(function(res) {
                        if (res.error && res.error.code && res.error.code == "EC_INVALID_APITOKEN") {
                            $global.invalidApiToken();
                            deffered.reject(res);
                        } else {
                            if (res.error && res.error.message) {
                               setToastMessage(res)
                            }
                            deffered.resolve(res);
                        }
                    }).error(function(error) {
                        $ionicLoading.hide();
                        $global.setBadRequest();
                        deffered.reject(error);
                    });
                }
                if (method == 'G') {
                    $http.get(url, {
                        headers: $global.getAuthorization()
                    }).success(function(res) {
                        if (res.error && res.error.code && res.error.code == "EC_INVALID_APITOKEN") {
                            $global.invalidApiToken();
                            deffered.reject(res);
                        } else {
                            if (res.error && res.error.message) {
                             setToastMessage(res)
                            }
                            deffered.resolve(res);
                        }
                    }).error(function(error) {
                        $ionicLoading.hide();
                        $global.setBadRequest();
                        deffered.reject(error);
                    });
                }
                if (method == 'D') {
                    $http.delete(url, {
                        headers: $global.getAuthorization()
                    }).success(function(res) {
                        if (res.error && res.error.code && res.error.code == "EC_INVALID_APITOKEN") {
                            $global.invalidApiToken();
                            deffered.reject(res);
                        } else {
                            if (res.error && res.error.message) {
                               setToastMessage(res)
                            }
                            deffered.resolve(res);
                        }
                    }).error(function(error) {
                        $ionicLoading.hide();
                        $global.setBadRequest();
                        deffered.reject(error);
                    });
                }
                return deffered.promise;
            }

        };
    });
