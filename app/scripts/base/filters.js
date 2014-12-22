define([], function() {
    'use strict';
    angular.module('pmtFilters', [])
        .filter('humanBytes', function() {
            // trans long bytes to human readable format
            return function(bytes, precision) {
                if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
                    return '';
                }
                if (typeof precision === 'undefined') {
                    precision = 1;
                }
                var units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'],
                    number = Math.floor(Math.log(bytes) / Math.log(1024));
                return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
            };
        })
        .filter('percentage', function() {
            return function(input) {
                var rounded = Math.round(input * 10000) / 100;
                if (isNaN(rounded)) {
                    return '';
                }
                var percentage = '' + rounded + '%';
                return percentage;
            };
        })
        .filter('replaceNewlineWithBr', function() {
            return function(content) {
                return content.replace(/\n/, '<br/>');
            }
        })
        .filter('joinArr', function() {
            return function(arr, pickerSep) {
                var parts = pickerSep.split(':');
                return _.pluck(arr, parts[0]).join(parts[1]);
            }
        });
});