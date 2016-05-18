'use strict';
angular.module('main')
    .controller('Appointment-listCtrl', function($scope, $filter, NgMap, sellRequests, $ionicModal, $global, $ionicPopup, $ionicLoading, $moment, $timeout, $state, $ionicScrollDelegate,$stateParams) {
            /*date picker */
            $scope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop();
        };
            function setDatePicker(disabledDate) {
                var disablePreviousDates = new Date();
                disablePreviousDates.setDate(disablePreviousDates.getDate() +(disabledDate-1)-1);
                // $scope.datepickerObject.inputDate = new Date();
               var datepickerObject = {};
                datepickerObject.inputDate = new Date();
                datepickerObject.inputDate.setDate(datepickerObject.inputDate.getDate() +(disabledDate-1)-1);
                var disabledDates = [];
                var monthList = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
                $scope.datepickerObject = {};
                $scope.datepickerObjectPopup = {
                    titleLabel: 'Select date', //Optional
                    todayLabel: 'Today', //Optional
                    closeLabel: 'Close', //Optional
                    setLabel: 'Set', //Optional
                    errorMsgLabel: 'Please select time.', //Optional
                    setButtonType: 'button-assertive', //Optional
                    modalHeaderColor: 'bar-positive', //Optional
                    modalFooterColor: 'bar-positive', //Optional
                    templateType: 'popup', //Optional
                    inputDate: datepickerObject.inputDate, //Optional
                    mondayFirst: false, //Optional
                    // disabledDates: disabledDates, //Optional
                    monthList: monthList, //Optional
                    from: disablePreviousDates, //Optional
                    callback: function(val) { //Optional
                        datePickerCallbackPopup(val);
                    }
                };
            }
                $scope.paymentModes = $global.paymentModes;

                var datePickerCallbackPopup = function(val) {
                    if (typeof(val) === 'undefined') {} else {
                        $scope.datepickerObjectPopup.inputDate = val;
                        var today = $moment().format('DD-MMM-YYYY')
                        var current = $moment($scope.datepickerObjectPopup.inputDate).format('DD-MMM-YYYY')
                        if (today != current) {
                            $scope.slots = $scope.allslots.allSlots;
                            $scope.reschedule.preferredSlot = $scope.slots[0].slotId;
                        } else {
                            if ($scope.allslots)
                                $scope.slots = $scope.allslots.presentDaySlots;
                        }
                    }
                };
                /*date picker end */

                $scope.map = {};
                var map;
                NgMap.getMap().then(function(evtMap) {
                    map = evtMap;
                });
                $scope.maps = [];
                $scope.$on('mapInitialized', function(evt, evtMap) {
                    $scope.maps.push(evtMap);
                });
                var bounds = new google.maps.LatLngBounds();

                function reRednerMap() {
                    $timeout(function() {
                        if (map) {
                            var currCenter = map.getCenter();
                            google.maps.event.trigger(map, 'resize');

                            map.setCenter(currCenter);
                        }
                    }, 500);
                }
                var completedParams = {
                    'page': 0,
                    'size': 10,
                    'status': 'completed'
                };
                var pendingParams = {
                    'page': 0,
                    'size': 10,
                    'status': 'pending'
                };
                $scope.updateSellRequest = function(id) {
                    $state.go('main.update-sell-items', {
                        'id': id
                    })
                }

                $scope.sellReuests = function(params) {
                    if($stateParams.fromdate){
                        params.fromdate = $stateParams.fromdate;
                    }
                    if($stateParams.fromdate){
                        params.todate = $stateParams.todate; 
                    }
                    
                    
                    sellRequests.getSellRquests(params).then(function(res) {
                        $ionicLoading.hide();
                        if (res.status == $global.SUCCESS) {
                            if (params.status == "completed")
                                $scope.completedSells = res.data.sells;
                            if (params.status == "pending")
                                $scope.pendingSells = res.data.sells;
                        }
                    }, function(err) {
                        $ionicLoading.hide();
                    })
                }
                $scope.getCompletedRequests = function() {
                    $ionicLoading.show();
                    $scope.sellReuests(completedParams);
                }
                $scope.getPendingRequests = function() {
                    $ionicLoading.show();
                    $scope.sellReuests(pendingParams);
                }
                $scope.declineSellItem = function(sell, index) {
                    var declineConfirmation = $ionicPopup.confirm({
                        title: 'Alert',
                        template: 'Do you want to decline Appointment?',
                        okType: 'button-assertive'
                    });
                    declineConfirmation.then(function(res) {
                        if (res) {
                            var obj = {
                                'sellObjId': sell.sellObjId,
                                'agentObjId': sell.agentObjId,
                            }
                            sellRequests.declineRequest(obj).then(function(res) {
                                if (res.status == $global.SUCCESS) {
                                    $scope.pendingSells.splice(index, 1);
                                    $global.showToastMessage(res.data.message, 'short', 'center');

                                }
                            })
                        }
                    });
                };
                $scope.rescheduleConfirmation = function(sell, index) {
                    var confirm = $ionicPopup.confirm({
                        title: 'Alert',
                        template: 'Do you want to reschedule Appointment?',
                        okType: 'button-assertive'
                    });
                    confirm.then(function(res) {
                        if (res) {
                            $scope.reschedule = {
                                'sellObjId': sell.sellObjId,
                                'agentObjId': sell.agentObjId,
                            }
                            $scope.showRescheduleModal(sell.preferredSlot);
                        }
                    });
                };
                $scope.submitReschedule = function() {
                    $scope.reschedule.preferredDate = $moment($scope.datepickerObjectPopup.inputDate).format('DD-MMM-YYYY');
                    $ionicLoading.show();
                    sellRequests.reschedule($scope.reschedule).then(function(res) {
                        if (res.status == $global.SUCCESS) {
                            $global.showToastMessage(res.data.message, 'short', 'center');
                            $scope.rescheduleModal.hide();
                            $scope.getPendingRequests();
                            $ionicLoading.hide();
                        } else if (res.status == $global.FAILURE) {
                            $global.showToastMessage(res.error.message, 'short', 'center');
                            $ionicLoading.hide();
                        }
                    })
                }
                $ionicModal.fromTemplateUrl('main/templates/reschedule-modal.html', {
                    scope: $scope,
                    animation: 'mh-slide'
                }).then(function(modal) {
                    $scope.rescheduleModal = modal
                });
                $scope.cancelReschedule = function() {
                    $scope.rescheduleModal.hide();
                }
                $scope.showRescheduleModal = function(slot) {
                    var disabledDate=1;
                    $ionicLoading.show();
                    $scope.rescheduleModal.show();
                    sellRequests.getSlots().then(function(res) {
                        $scope.allslots = res.data;
                        $scope.slots = res.data.presentDaySlots;
                        for (var i = $scope.slots.length - 1; i >= 0; i--) {
                            if ($scope.slots[i].status != "Disabled") {
                                $scope.reschedule.preferredSlot = $scope.slots[i].slotId;
                                break;
                            }
                        };
                        if (!$scope.reschedule.preferredSlot) {
                            disabledDate=2
                            $scope.slots = res.data.allSlots;
                            $scope.reschedule.preferredSlot = $scope.slots[0].name;
                        }
                        setDatePicker(disabledDate);
                        $ionicLoading.hide();
                    }, function(err) {
                        $ionicLoading.hide();
                    })
                };

                $scope.showConfirm = function(sell) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Alert',
                        template: 'Do you want to delete Appointment?',
                        okType: 'button-assertive'
                    });
                    confirmPopup.then(function(res) {
                        if (res) {
                            SellNow.cancelSellRquests(sell.confirmationId).then(function(res) {
                                $scope.sellReuests(pendingParams);
                            })
                        }
                    });
                };

                $ionicModal.fromTemplateUrl('main/templates/appointment-detail-modal.html', {
                    scope: $scope,
                    animation: 'mh-slide'
                }).then(function(modal) {
                    $scope.showAppointmentModal = modal
                });

                $scope.showAppointment = function(id) {
                    $ionicLoading.show();
                    $scope.showAppointmentModal.show();
                    sellRequests.getSellById(id).then(function(res) {
                        $scope.sellDetails = res.data.sell;
                        $ionicLoading.hide();
                    }, function(err) {
                        $ionicLoading.hide();
                    })

                };

                $scope.appointmentCloseModal = function() {
                    $scope.showAppointmentModal.hide();
                };

                $ionicModal.fromTemplateUrl('main/templates/appointment-directions-modal.html', {
                    scope: $scope,
                    animation: 'mh-slide'
                }).then(function(modal) {
                    $scope.showDirectionsModal = modal
                });
                $scope.showDirections = function(id) {
                    $ionicLoading.show();
                    $scope.showDirectionsModal.show();
                    sellRequests.getSellById(id).then(function(res) {
                        $scope.sellDetails = res.data.sell;
                        if ($scope.sellDetails.agentAddress) {
                            var destination = [];
                            destination.push($scope.sellDetails.agentAddress.latitude);
                            destination.push($scope.sellDetails.agentAddress.longitude);
                            $scope.sellDetails.destination = destination.join();
                        }
                        if ($scope.sellDetails.consumerAddress) {
                            var origin = [];
                            origin.push($scope.sellDetails.consumerAddress.latitude);
                            origin.push($scope.sellDetails.consumerAddress.longitude);
                            $scope.sellDetails.origin = origin.join();
                        }
                        $timeout(function() {
                            reRednerMap();
                        });
                        $ionicLoading.hide();

                    })

                };

                $scope.directionsCloseModal = function() {
                    $scope.showDirectionsModal.hide();
                    $scope.sellDetails = '';
                };

            });
