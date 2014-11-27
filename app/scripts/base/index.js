define([
    'base/directives',
    'base/filters',
    'base/services',
    'base/oem',
    'base/formly'
], function() {
    'use strict';
    angular.module('pmtBase', ['pmtDirectives', 'pmtFilters', 'pmtServices', 'oemBase', 'formly']);
});