define([
    'base/index',
    'app_vertical/directives',
    'app_vertical/services',
    'app_vertical/controllers'
], function() {

    var appVerticalApp = angular.module('appVerticalApp', ['pmtBase', 'angularFileUpload', 'appVerticalApp.directives', 'appVerticalApp.services', 'appVerticalApp.controllers']);

    appVerticalApp.config(function($routeHelperProvider, $urlRouterProvider) {
        $routeHelperProvider.configFromDict({
            'appVertical': {
                nickName: 'appVertical',
                url: '/app_vertical',
                abstract: true,
                title: 'Open API 配置 - 开发者中心 - 豌豆荚',
                views: {
                    '@': {
                        templateUrl: 'templates/app_vertical/index.html',
                        controller: 'configIdxCtrl'
                    },
                    'meta-header': {
                        templateUrl: 'templates/_base/meta-header-oem.html'
                    }
                }
            },
            'appVertical.topApp': {
                url: '/:alias/topapp',
                views: {
                    'config': {
                        templateUrl: 'templates/app_vertical/config-topapp.html',
                        controller: 'configTopAppCtrl'
                    }
                }
            },
            'appVertical.banner': {
                url: '/:alias/banner',
                views: {
                    'config': {
                        templateUrl: 'templates/app_vertical/config-banner.html',
                        controller: 'configBannerCtrl'
                    }
                }
            },
            'appVertical.oemApkReplace': {
                url: '/:alias/apk',
                views: {
                    'config': {
                        templateUrl: 'templates/app_vertical/config-apk.html',
                        controller: 'configApkCtrl'
                    }
                }
            },
            'appVertical.forbiddenApps': {
                url: '/:alias/forbidden',
                views: {
                    'config': {
                        templateUrl: 'templates/app_vertical/config-forbidden.html',
                        controller: 'configForbiddenCtrl'
                    }
                }
            },
            'appVertical.newFeature': {
                url: '/:alias/column',
                views: {
                    'config': {
                        templateUrl: 'templates/app_vertical/config-column.html',
                        controller: 'configColumnCtrl'
                    }
                }
            }
        });
        $urlRouterProvider.when('/app_vertical', '/app_vertical//topapp');
    }).run(function(apiHelper) {
        // App Vertical module
        apiHelper.config({
            // global
            'fetchAppsAuth': 'GET ',
            'fetchBdConfigs': 'GET /bdconfigs',

            // general - topapp/forbidden
            'setConfigVal': 'POST /tabContent',

            // apk
            'setReplaceApk': 'POST /oemApk',
            'confirmReplaceApk': 'POST /oemApk/confirm',
            'delReplaceApk': 'GET /oemApk/delete',

            // columns
            'setColumn': 'POST /bdcolumns',

            // banner related
            'fetchBannerConfig': 'GET /banner/position',
            'fetchBannerAll': 'GET /banners',
            'setBanner': 'POST /banner',
            'fetchSpecBanner': 'GET /banner/adjust',
            'adjustBanner': 'POST /banner/adjust',
            'delBanner': 'GET /banner/delete'
        }, {
            urlPrefix: window._ServerUrl + '/api/apps'
        });
    });;
});