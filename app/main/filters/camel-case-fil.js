'use strict';
angular.module('main')
    .filter('camelCaseFilter', function() {
        return function(input) {
            input = input || '';
            return input.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        };

    });