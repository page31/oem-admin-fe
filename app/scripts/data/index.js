define([
    'base/index',
    'data/controllers'
], function() {

    var dataApp = angular.module('dataApp', ['pmtBase', 'dataApp.controllers']);

    dataApp.config(function($routeHelperProvider) {
        $routeHelperProvider.configFromDict({
            'data': {
                url: '/data',
                abstract: true,
                templateUrl: '/templates/data/index.html',
                title: '查看数据 - 开发者中心 - 豌豆荚'
            },
            'data.index': {
                url: '',
                templateUrl: '/templates/data/report.html',
                title: '查看数据 - 开发者中心 - 豌豆荚',
                controller: 'reportCtrl'
            },
            'data.appDownload': {
                url: '/app_download',
                templateUrl: '/templates/data/usage.html',
                title: ' 应用数据 - 开发者中心 - 豌豆荚',
                controller: 'usageCtrl'
            }
        });
    });
});