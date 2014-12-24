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
                templateUrl: 'templates/app_vertical/index.html',
                title: 'Open API 配置 - 开发者中心 - 豌豆荚',
                controller: 'configCtrl'
            }
        });
    });
});