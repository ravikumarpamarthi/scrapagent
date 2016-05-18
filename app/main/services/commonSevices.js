'use strict';
angular.module('main')
    .service('commonSevices', function($global, httpService) {
        return {
            getAbout: function() {
                var url = $global.getApiUrl() + $global.getApiObject().getAbout;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            getFaqs: function() {
                var url = $global.getApiUrl() + $global.getApiObject().getFaqs;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            getReferral: function() {
                var consumerId = $global.consumerId;
                var url = $global.getApiUrl() + $global.getApiObject().getReferral.replace(":cid",consumerId);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            uploadFile: function(file) {
                var url = $global.getApiUrl() + $global.getApiObject().uploadFile;
                var $request = httpService.uploadRequest(url,file);
                return $request;
            },
            getAddress: function(id) {
                var url = $global.getApiUrl() + $global.getApiObject().getAddressById.replace(":id",id);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            getCalendar: function(from,to) {
                var agentId=$global.agentId;
                var url = $global.getApiUrl() + $global.getApiObject().getCalendar.replace(":agentId",agentId).replace(":from",from).replace(":to",to);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            }
        };

    });
