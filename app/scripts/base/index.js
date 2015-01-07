define([
    'base/api',
    'base/directives',
    'base/filters',
    'base/services',
    'base/oem',
    'base/formly'
], function() {
    'use strict';
    angular.module('pmtBase', ['siva.apiUtilities', 'pmtDirectives', 'pmtFilters', 'pmtServices', 'oemBase', 'formly']);
});