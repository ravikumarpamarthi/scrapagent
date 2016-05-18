'use strict';
angular.module('main')
.factory('BidService', function ($global, httpService) { 
	return {
             getBidById: function(id) {
                var url = $global.getApiUrl() + $global.getApiObject().getBidById.replace(":id",id);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
             getBids: function(params) {
                var consumerId=$global.agentId;
                params.agentid=consumerId;
                var params="?"+$global.objToQueryString(params);
                var url = $global.getApiUrl() + $global.getApiObject().getBids+params;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
             getOpenBids: function(params) {
                var url = $global.getApiUrl() + $global.getApiObject().getOpenBids;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
             acceptOpenBid: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().acceptOpenBid;
                var $request = httpService.httpRequest(url, "P",data);
                return $request;
            }
        };
});
