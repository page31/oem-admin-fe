define([
    'base/index',
    'app_vertical/directives',
    'app_vertical/services',
    'app_vertical/controllers'
], function() {

    var appVerticalApp = angular.module('appVerticalApp', ['pmtBase', 'appVerticalApp.directives', 'appVerticalApp.services', 'appVerticalApp.controllers']);

    /*appVerticalApp.factory('$configData', [

        function() {
            // data for configing the interface , and endpoint for uploading etc
            return {
                recommendsCandidates: [{
                    key: 'indexTopApps',
                    name: '应用首页'
                }, {
                    key: 'gameTopApps',
                    name: '游戏首页'
                }, {
                    key: 'appEssential',
                    name: '应用装机必备'
                }, {
                    key: 'gameEssential',
                    name: '游戏装机必备'
                }],
                subNavList: [{
                    id: 'channel',
                    name: '渠道管理'
                }, {
                    id: 'app',
                    name: '应用管理'
                }, {
                    id: 'recommends',
                    name: '推荐位管理',
                    description: '备注：推荐的应用包名列表，用换行分隔。'
                }, {
                    id: 'banner',
                    name: 'Banner 管理'
                }, {
                    id: 'forbiddenApps',
                    name: '黑名单管理',
                    description: '备注：以下应用将不会出现在应用列表中（含分类，搜索结果）；请在下面填写包名列表，用换行分隔。'
                }, {
                    id: 'categoryTopApps',
                    name: '分类排序自定义',
                    description: '备注：以下应用将在所有的分类列表中靠前优先展示。内容请直接填写应用的包名列表，用换行分隔。'
                }, {
                    id: 'searchTopApps',
                    name: '搜索自定义',
                    description: '备注：在搜索 API 中搜索特定关键词时，如下应用将优先靠前展现在搜索结果列表中。填写格式：包名#关键词1,关键词2，用换行分隔。例如：<br/>com.tencent.mm#微信,QQ<br/>com.tencent.mobileqq#QQ,QQ2014'
                }, {
                    id: 'oemSpecial',
                    name: '专区管理',
                    description: '备注：以下应用将作为本ID的专区存在，仅需填写相关包名即可，用换行分隔。'
                }]
            };
        }
    ]);
*/
    appVerticalApp.config(function($routeHelperProvider) {
        // window.appVerticalMenuList = $configData.appVerticalMenuList;
        $routeHelperProvider.configFromDict({
            'appVertical': {
                nickName: 'config',
                url: '/open-api/config/:alias?/:type?',
                templateUrl: '/templates/app_vertical/index.html',
                title: 'Open API 配置 - 开发者中心 - 豌豆荚',
                controller: 'configCtrl'
            }
        });
    }).run(['$rootScope', '$http', '$configData', 'dataService',
        function($rootScope, $http, $configData, dataService) {
            $rootScope.subNavList = $configData.subNavList;
        }
    ]);
});