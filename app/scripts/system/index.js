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

        var allOemChoicesField = {
            label: '可管理的 OEM/API',
            controlTpl: 'auth/available-partner-list-snippet.html' // 异步接口数据，自定义 checkbox
        };
        var onlyOemChoiceField = {
            label: '可管理的 OEM/API',
            type: 'select',
            optionStr: 'i.configAlias as i.configName for i in $root.authMeta.authorizedOem'
        };

        var FORMMAP = {
            channel: {
                modalTitle: 'OEM 渠道',
                formFields: [{
                    label: '渠道名称',
                    key: 'sourceName',
                    placeholder: '例如， 联想 K900'
                }, {
                    label: '渠道 User Source',
                    key: 'sourceAlias',
                    placeholder: '例如， lenovo_K900'
                }]
            },
            oemPartner: {
                modalTitle: 'OEM 合作方',
                formFields: [{
                    label: '合作方名称',
                    key: 'bdConfigDetail.configName',
                    placeholder: '例如， 联想'
                }, {
                    label: 'OEM 合作方 ID',
                    key: 'bdConfigDetail.configAlias',
                    placeholder: '例如， lenovo'
                }, {
                    label: 'OEM 渠道',
                    controlTpl: 'system/channel-list-snippet.html'
                }],
                submit: function() {
                    console.log(this.formlyData);
                }
            },
            apiPartner: {
                modalTitle: 'API 合作方',
                formFields: [{
                    label: 'API 合作方名称',
                    key: 'alias',
                    placeholder: '例如：赶集网'
                }, {
                    label: 'API 合作方授权 ID',
                    key: 'id',
                    placeholder: '例如：赶集网'
                }, {
                    label: 'API 方下载豌豆荚 APK  包的 URL (可选)',
                    key: 'wandoujiaDownloadUrl',
                    placeholder: '用于追踪 API 合作方为豌豆荚这款应用带来的装机量'
                }, {
                    label: '优质应用变更时通知合作方的 API 地址（可选）',
                    key: 'superiorChangeNotifyUrl',
                    placeholder: '由合作方提供，在优质应用变更时调用'
                }, {
                    label: '接口访问频率权限',
                    key: 'type',
                    type: 'select',
                    optionStr: 'name as val for (name, val) in $root.tokenMeta.candidateTokenType'
                }, {
                    label: '开放的接口',
                    key: 'privileges',
                    controlTpl: 'system/api-partner-interfaces-snippet.html'
                }] // Todo: add multi checkbox support
            },
            auth: {
                modalTitle: '账户',
                formFields: [{
                        label: '豌豆荚账户',
                        key: 'wdjAccount'
                    }, {
                        label: '账户角色',
                        key: 'role',
                        type: 'select',
                        optionStr: 'i.name as i.alias for i in $root.authMeta.groups'
                    },
                    allOemChoicesField, {
                        label: '开设权限',
                        controlTpl: 'auth/available-authorizeditem-list-snippet.html' // 异步接口数据，自定义 checkbox
                    }
                ],
                initCb: function(e) {
                    var self = this;
                    this.$watch('formlyData.isSelectAllOems', function(val) {
                        if (_.isUndefined(val)) return;
                        _.each(self.formlyData._authorizedOem, function(_val, k) {
                            self.formlyData._authorizedOem[k] = val;
                        });
                    }, true);

                    this.$watch('formlyData.role', function(val) {
                        if (val === 'GROUP_USER_V') {
                            self.formFields[2] = onlyOemChoiceField;
                        } else {
                            self.formFields[2] = allOemChoicesField;
                        }
                    });
                }
            }
        };

        var BeforeTransformer = {
            channel: function(res, meta) {
                res.configAlias = meta.raw.bdConfigDetail.configAlias;
            },
            apiPartner: function(res) {
                /* trans _privileges */
                var _privileges = res.privileges;
                res.privileges = _.clone($scope.$root.tokenMeta.candidatePrivileges);
                _.each(_privileges, function(i) {
                    res.privileges[i] = true;
                });
            },
            auth: function(res) {
                /* trans authorizedOem */
                var _authorizedOem = res.authorizedOem;
                res._authorizedOem = {};
                _.each(_.pluck($scope.$root.authMeta.authorizedOem, 'configAlias'), function(i) {
                    res._authorizedOem[i] = false;
                });
                _.each(_authorizedOem, function(i) {
                    res._authorizedOem[i.configAlias] = true;
                });
            }
        };

        // Todo: 为什么 child 访问不到？！
        // 离开的时候，恢复$root
        $scope.$root.onEdit = function(type, item, meta) {
            BeforeTransformer[type] && BeforeTransformer[type](item, meta);
            formlyHelper.openModal(FORMMAP[type], item);
        };
        $scope.$root.onAdd = function(type) {
            formlyHelper.openModal(FORMMAP[type]);
        };
        $scope.$root.onDel = function(type, item) {
            if (window.confirm('您确定要删除该资源吗？')) {
                apiHelper('del' + type).then(function() {});
            }
        };
        // Todo: with formName: <账户>, type: add/modify to compute modalTitle
        // Todo: 根据 role 的取值，需要切换 formFields 内容！ - accountPartnerForm
    });

    systemApp.controller('systemPartnerCtrl', function($scope, apiHelper) {
        apiHelper('fetchTokenMeta').then(function(r) {
            $scope.$root.tokenMeta = r;
        });
        // pickup from resp.data with specfic fields
        // add raw item for each row, which include other info which not to show
        apiHelper('fetchApiPartners').then(function(r) {
            $scope.apiPartnerList = r.beans;
        });
        apiHelper('fetchOemPartners').then(function(r) {
            $scope.oemPartnerList = r.beans;
        });
    });

    systemApp.controller('systemAccountCtrl', function($scope, apiHelper) {

        apiHelper('fetchAuthMeta', {
            busy: 'global'
        }).then(function(r) {
            // process hook for auth meta
            _.each(r.authorizedItems.authorizedLevel2, function(val, key) {
                r.authorizedItems.authorizedLevel1[key].children = val;
            });
            $scope.$root.authMeta = r;
        });

        apiHelper('fetchAuths').then(function(r) {
            $scope.authList = r.beans;
        });

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