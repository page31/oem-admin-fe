define([
    'base/index',
    'app_vertical/directives',
    'app_vertical/services',
    'app_vertical/controllers'
], function() {

    var appVerticalApp = angular.module('appVerticalApp', ['pmtBase', 'appVerticalApp.directives', 'appVerticalApp.services', 'appVerticalApp.controllers']);

    appVerticalApp.config(function($routeHelperProvider) {
        $routeHelperProvider.configFromDict({
            'appVertical': {
                nickName: 'appVertical',
                url: '/app_vertical/:alias?/:type?',
                title: 'Open API 配置 - 开发者中心 - 豌豆荚',
                views: {
                    '@': {
                        templateUrl: 'templates/app_vertical/index.html',
                        controller: 'configCtrl'
                    },
                    'meta-header': {
                        templateUrl: 'templates/_base/meta-header-oem.html'
                    }
                }
            }
        });
    });
});