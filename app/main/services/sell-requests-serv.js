'use strict';
angular.module('main')
.service('sellRequests', function ($global, httpService) {

  return {
            sellNow: function(data,type) {
                var url;
                if(type=="PICKUP")
                 url = $global.getApiUrl() + $global.getApiObject().sellNowPickup;
                if(type=="DROP")
                 url = $global.getApiUrl() + $global.getApiObject().sellNowDrop;
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
            getSellById:function(id){
                var url = $global.getApiUrl() + $global.getApiObject().getSellById.replace(":id",id);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            getSlots:function(){
                 var url = $global.getApiUrl() + $global.getApiObject().getSlots;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            getSellRquests:function(params){
                var agentId=$global.agentId;
                params.agentid=agentId;                
                var params="?"+$global.objToQueryString(params);
                 var url = $global.getApiUrl() + $global.getApiObject().getSellRquests+params;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            getAgents:function(lat,lng){
                 var url = $global.getApiUrl() + $global.getApiObject().getAgentsByLatLng.replace(":lng",lng).replace(":lat",lat);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            cancelSellRquests:function(confirmationId){
                 var url = $global.getApiUrl() + $global.getApiObject().cancelSellRquests.replace(":cid",confirmationId);
                var $request = httpService.httpRequest(url, "P");
                return $request;
            },
            updateSellItems:function(data){
                 var url = $global.getApiUrl() + $global.getApiObject().updateSellItems;
                var $request = httpService.httpRequest(url, "P",data);
                return $request;
            },
            completeSellItems:function(data){
                 var url = $global.getApiUrl() + $global.getApiObject().completeSellItems;
                var $request = httpService.httpRequest(url, "P",data);
                return $request;
            },
            declineRequest:function(data){
                var url = $global.getApiUrl() + $global.getApiObject().declineRequest;
                var $request = httpService.httpRequest(url, "P",data);
                return $request;
            },
            reschedule:function(data){
                var url = $global.getApiUrl() + $global.getApiObject().reschedule;
                var $request = httpService.httpRequest(url, "P",data);
                return $request;
            },
            bulksale:function(data){
                var url = $global.getApiUrl() + $global.getApiObject().bulksale;
                var $request = httpService.httpRequest(url, "P",data);
                return $request;
            },
            getBulkSales:function(data){
                var url = $global.getApiUrl() + $global.getApiObject().getBulkSales.replace(":aid",$global.agentId);
                var $request = httpService.httpRequest(url, "G","");
                return $request;
            }
        }

});
