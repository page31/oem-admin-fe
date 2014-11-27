define(['base/index'], function() {
    var systemApp = angular.module('systemApp', ['pmtBase']);

    /* Routers defined here */
    // require/define 的区别 - 导致dependence 未 ready
    // Fuck config 不能配置 factory!!
    systemApp.config(function($routeHelperProvider, $stateProvider) {
        $stateProvider.state('system', {
            url: '/system',
            templateUrl: 'templates/system/index.html',
            controller: 'systemCtrl'
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
    });

    function wrapTable(data, opt) {
        _.extend(data, opt || {});
    }

    /* Controllers defined here */
    systemApp.controller('systemCtrl', function($scope, formlyHelper) {
        // extract to i18n
        $scope.menuList = systemMenuList;

        var channelForm = {
            modalTitle: '添加 OEM 渠道',
            formFields: [{
                label: '渠道名称',
                key: 'channelName',
                placeholder: '例如， 联想 K900'
            }, {
                label: '渠道 User Source',
                key: 'channelSource',
                placeholder: '例如， lenovo_K900'
            }]
        };

        var apiPartnerForm = {
            modalTitle: '添加 API 合作方',
            formFields: [{
                label: 'API 合作方名称',
                key: 'hzfcmc1',
                placeholder: '例如：赶集网'
            }, {
                label: 'API 合作方授权 ID',
                key: 'hzfcmc2',
                placeholder: '例如：赶集网'
            }, {
                label: 'API 方下载豌豆荚 APK  包的 URL (可选)',
                key: 'hzfcmc3',
                placeholder: '用于追踪 API 合作方为豌豆荚这款应用带来的装机量'
            }, {
                label: '优质应用变更时通知合作方的 API 地址（可选）',
                key: 'hzfcmc4',
                placeholder: '由合作方提供，在优质应用变更时调用'
            }, {
                label: '接口访问频率权限',
                key: 'hzfcmc5',
                optionStr: 'idx as opt for (idx, opt) in options.options',
                options: ['高级授权', '中级授权', '低级授权']
            }, {
                label: '开放的接口',
                key: 'hzfcmc',
                placeholder: '例如：赶集网'
            }] // Todo: add multi checkbox support
        };

        // Todo: with formName: <账户>, type: add/modify to compute modalTitle
        // Todo: 根据 role 的取值，需要切换 formFields 内容！ - accountPartnerForm
        var accountForm = {
            modalTitle: '添加新账户',
            formFields: [{
                label: '豌豆荚账户',
                key: 'wdjAccount'
            }, {
                label: '账户角色',
                key: 'role',
                optionStr: 'idx as opt for (idx, opt) in options.options',
                options: ['内部运营', '外部运营', '厂商工作人员']
            }, {
                label: '可管理的 OEM/API',
                controlTpl: '' // 异步接口数据，自定义 checkbox
            }, {
                label: '开设权限',
                controlTpl: ''
            }]
        };

        formlyHelper.openModal(apiPartnerForm);
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