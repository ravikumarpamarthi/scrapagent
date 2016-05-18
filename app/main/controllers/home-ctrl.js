'use strict';
angular.module('main')
    .controller('HomeCtrl', function($scope, $compile, $moment, commonSevices, uiCalendarConfig, $state) {
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        $scope.changeTo = 'Hungarian';

        var reqObj;

        function getCalenderInfo(from, to) {
            commonSevices.getCalendar(from, to).then(function(res) {
                reqObj = res.data.sellCalendars;
                parseCalenderObj(reqObj);
            });
        }
        $scope.events = [];
        $scope.monthEvents = [];

        function parseCalenderObj(reqObj) {
            $scope.monthEvents.splice(0,$scope.monthEvents.length);
            $scope.events.splice(0,$scope.events.length);
            for (var i = reqObj.length - 1; i >= 0; i--) {
                var month = {
                    title: reqObj[i].dayCount,
                    start: reqObj[i].day

                };
                $scope.monthEvents.push(month);
                for (var j = reqObj[i].slotWiseCounts.length - 1; j >= 0; j--) {
                    var obj = {
                        title: reqObj[i].slotWiseCounts[j].value,
                        dayCount: reqObj[i].dayCount,
                    };
                    var slot = reqObj[i].slotWiseCounts[j].name.split('-');
                    obj.start = reqObj[i].day + 'T' + slot[0] + ':00';
                    obj.end = reqObj[i].day + 'T' + slot[1] + ':00';
                    $scope.events.push(obj);
                };
            };
        }
        $scope.eventSources = [];
        $scope.eventSources.push($scope.monthEvents);
        $scope.appointmentList = function(date, jsEvent, view) {
            var fromdate = date.start.format("DD-MMM-YYYY");       
            
            $state.go('main.appointmentListFilter',{fromdate:fromdate,todate:fromdate})
        };
        /* config object */
        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                defaultView: 'agendaDay',
                header: {
                    left: 'title',
                    center: '',
                    right: 'agendaDay month prev,next'
                },
                events: function(start, end) {
                    getCalenderInfo(start.format("DD-MMM-YYYY"), end.format("DD-MMM-YYYY"));
                },
                eventRender: function(event, element, view) {
                    if (view.name == "month") {
                        element.find('.fc-title').html(event.dayCount);
                    } else {
                        event.title = event.title;
                    }
                },
                viewRender: function(view, element) {

                    if (view.name == "month") {
                         setEvents($scope.monthEvents)
                    } else {
                         setEvents($scope.events)
                    }
                },
                eventClick: $scope.appointmentList,
                /* dayClick: function(date, jsEvent, view) {

                     alert('Clicked on: ' + date.format());

                     alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);

                     alert('Current view: ' + view.name);

                     // change the day's background color just for fun
                     $(this).css('background-color', 'red');

                 },*/
                // eventBackgroundColor: '#378006'
                // eventDrop: $scope.alertOnDrop,
                // eventResize: $scope.alertOnResize,
                // eventRender: $scope.eventRender
            }
        };

        function setEvents(events){
            uiCalendarConfig.calendars['myCalendar'].fullCalendar('removeEvents');
            uiCalendarConfig.calendars['myCalendar'].fullCalendar('addEventSource', events);

        }
        /* event sources array*/
    });
