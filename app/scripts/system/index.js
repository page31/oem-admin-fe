define(['base/index', 'system/util', 'system/ctrls/base', 'system/ctrls/biz'], function() {
    var systemApp = angular.module('systemApp', [
        'pmtBase', 'systemApp.baseCtrl', 'systemApp.bizCtrl'
    ]);
    /* Routers defined here */
    // require/define 的区别 - 导致dependence 未 ready
    // Fuck config 不能配置 factory!!
    systemApp.config(function($routeHelperProvider, $stateProvider, $urlRouterProvider) {
        $stateProvider.state('system', {
            url: '/system',
            abstract: true,
            views: {
                'meta-header': {
                    template: '<p>请谨慎使用 Admin 权限</p>'
                },
                '@': {
                    templateUrl: 'templates/system/index.html',
                    controller: 'systemCtrl'
                }
            }
        });

        var systemMenuList = [{
            name: '管理 OEM / API',
            id: 'partner'
        }, {
            name: '管理账户权限',
            id: 'account'
        }, {
            name: '检测 API 状态',
            id: 'status'
        }, {
            name: '查看日志',
            id: 'log'
        }, {
            name: '管理 OEM 栏目',
            id: 'column'
        }];
        window.systemMenuList = systemMenuList;
        $routeHelperProvider.configChild('system', systemMenuList);
        $urlRouterProvider.when('/system', '/system/partner');
    });

    systemApp.run(function(apiHelper) {
        // Admin module
        apiHelper.config({

            'fetchApiPartners': 'GET /token',
            'delApiPartner': 'GET /token/delete',
            'setApiPartner': 'POST /token/edit',

            'fetchOemPartners': 'GET /oem/bdconfig',
            'setOemPartner': 'POST /oem/bdconfig/edit',
            'delOemPartner': 'GET /oem/bdconfig/delete',
            'setOemSource': 'POST /oem/bdsource/edit',
            'delOemSource': 'GET /oem/bdsource/delete',

            'fetchAuths': 'GET /auth',
            'setAuth': 'POST /auth/edit',
            'delAuth': 'GET /auth/delete',

            'fetchAuthMeta': 'GET /auth/candidateType',
            'fetchTokenMeta': 'GET /token/candidateType',

            'fetchLog': 'GET /survey/log',
            'fetchQuota': 'GET /survey/quota',

            'fetchColumns': 'GET /oem/bdcolumns',
            'setColumn': 'POST /oem/bdcolumns/edit',
            'delColumn': 'GET /oem/bdcolumns/delete'
        }, {
            urlPrefix: window._ServerUrl + '/api/admin'
        });
    });
});