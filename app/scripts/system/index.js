define(['base/index'], function() {
    var systemApp = angular.module('systemApp', ['pmtBase']);

    /* Routers defined here */
    // require/define 的区别 - 导致dependence 未 ready
    // Fuck config 不能配置 factory!!
    systemApp.config(function($routeHelperProvider) {
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
    });

    function wrapTable(data, opt) {
        _.extend(data, opt || {});
    }

    /* Controllers defined here */
    systemApp.controller('systemCtrl', function($scope) {
        // extract to i18n
        $scope.menuList = systemMenuList;
    });

    systemApp.controller('systemPartnerCtrl', function($scope) {
        // pickup from resp.data with specfic fields
        // add raw item for each row, which include other info which not to show
        $scope.tableHead = ['合作方名称', '合作方 ID', '接口访问次数限制', '操作'];
        $scope.tableData = [
            ['联想', 'Lneno', '3'],
            ['联想', 'Lneno', '3']
        ];
        wrapTable($scope.tableData, {
            editable: true,
            deletable: true,
            type: 'partner'
        });

        // Todo: 为什么 child 访问不到？！
        // 离开的时候，恢复$root
        $scope.$root.onEdit = function(type, row) {
            // row.raw - default item resource data
            console.log(arguments);
        };
        $scope.onDel = function(type, row) {
            // row.raw - default item resource data
            console.log(arguments);
        };
    });

    systemApp.controller('systemAccountCtrl', function($scope) {
        $scope.tableData = [
            ['daniel@wandoujia.com', ' 内部运营', '无', 4],
            ['daniel@wandoujia.com', ' 内部运营', '无', 5]
        ];
    });

    systemApp.controller('systemStatusCtrl', function($scope) {
        $scope.tableData = [
            ['搜索接口', 5000, 4222, '49min'],
            ['搜索接口', 5000, 4222, '9min']
        ];
    });

    systemApp.controller('systemLogCtrl', function($scope) {
        $scope.tableData = [
            ['2014年11月21日', 'daniel@wandoujia.com', '可根据时间查询账户操作日志内容,时间默认选择当天'],
            ['2014年11月21日', 'daniel@wandoujia.com', '可根据时间查询账户操作日志内容,时间默认选择当天']
        ];
    });

    systemApp.controller('systemColumnCtrl', function($scope) {
        $scope.tableData = [
            ['华硕', '华硕周周 Zen 项', '']
        ];
    });
})