define([
    'base/directives',
    'base/filters',
    'base/services',
    'base/oem',
    'base/formly',
    'base/api'
], function() {
    'use strict';
    angular.module('pmtBase', ['pmtDirectives', 'pmtFilters', 'pmtServices', 'oemBase', 'formly', 'siva.apiUtilities']);
});