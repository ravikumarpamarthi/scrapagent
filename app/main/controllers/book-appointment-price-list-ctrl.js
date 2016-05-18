'use strict';
angular.module('main')
    .controller('Book-appointment-price-listCtrl', function($scope) {
    	var shades=[1,2,5,6,9,10,13,14,17,18,21,22,25,26,29,30,33,34,37,38,41,42];       

        $scope.inShades=function(index){
            return shades.indexOf(index) != -1
        }

        $scope.categories = [{
            "id": 1,
            "name": "E-WASTE",
            "price": 10,
            "image": "http://scrapq.digitelenetworks.com/scrapq/fileManager/getImageFileById/568e04240e4e680380fbb099.jpg",
            "priceRangeSlider": {
                "min": 0,
                "max": 50,
                "value": 10
            },
            "qtyRangeSlider": {
                "min": 0,
                "max": 50,
                "value": 10
            },
            'uom': 'Kg'
        }, {
            "id": 2,
            "name": "BOTTLES",
            "price": 20,
            "image": "http://scrapq.digitelenetworks.com/scrapq/fileManager/getImageFileById/568e04000e4e680380fbb096.jpg",
            "priceRangeSlider": {
                "min": 0,
                "max": 50,
                "value": 20
            },
            "qtyRangeSlider": {
                "min": 0,
                "max": 50,
                "value": 30
            },
            'uom': 'Kg'
        }, {
            "id": 1,
            "name": "ALLUMINIUM",
            "price": 10,
            "image": "http://scrapq.digitelenetworks.com/scrapq/fileManager/getImageFileById/568e03b00e4e680380fbb090.jpg",
            "priceRangeSlider": {
                "min": 0,
                "max": 50,
                "value": 23
            },
            "qtyRangeSlider": {
                "min": 0,
                "max": 50,
                "value": 15
            },
            'uom': 'Kg'
        }, {
            "id": 2,
            "name": "PLASTIC",
            "price": 20,
            "image": "http://scrapq.digitelenetworks.com/scrapq/fileManager/getImageFileById/568e03d70e4e680380fbb093.jpg",
            "priceRangeSlider": {
                "min": 0,
                "max": 50,
                "value": 44
            },
            "qtyRangeSlider": {
                "min": 0,
                "max": 50,
                "value": 26
            },
            'uom': 'Kg'
        }];


    });
