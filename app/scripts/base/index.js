define([
    'base/directives',
    'base/filters',
    'base/oem',
    'base/formly'
], function() {
    'use strict';
    angular.module('pmtBase', ['pmtDirectives', 'pmtFilters', 'oemBase', 'formly']);
});