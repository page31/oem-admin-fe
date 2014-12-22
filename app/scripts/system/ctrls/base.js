define([], function() {
    var systemApp = angular.module('systemApp.baseCtrl', ['pmtBase']);
    systemApp.controller('systemCtrl', function($scope, formlyHelper, apiHelper) {
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
                }],
                submit: function() {
                    // setOemSource
                    apiHelper('setOemSource', {
                        data: this.formlyData
                    }).then(function(r) {
                        // use ref to add updated/added res back
                    });
                    console.log(this.formlyData);
                }
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
                    apiHelper('setOemPartner', {
                        data: this.formlyData
                    }).then(function(r) {
                        // after success update store data
                    });
                    console.log(this.formlyData);
                },
                initCb: function() {
                    var self = this;
                    this.$on('oemPartner:channel:add', function(e, d) {
                        self.formlyData.bdSourceDetails.push(d);
                    });
                    this.$on('oemPartner:channel:remove', function(e, d) {
                        self.formlyData.bdSourceDetails.splice(d, 1);
                    });
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
                }], // Todo: add multi checkbox support
                submit: function() {
                    apiHelper('setApiPartner', {
                        data: this.formlyData
                    }).then(function(r) {
                        // after success update store data
                    });
                }
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
                submit: function() {
                    console.log(this.formlyData);
                },
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

                    /*this.$watch('formlyData.authorizedItems.authorizedLevel1', function(val) {
                            _.each(val, function(i, k) {
                                if(i.selected) {
                                    _.each(self.formlyData.authorizedItems.authorizedLevel2[i.alias], function(i) {
                                        i.selected = true;
                                    });
                                }
                            });
                        }, true);

                        this.$watch('formlyData.authorizedItems.authorizedLevel2', function(val) {
                            _.each(val, function(level1, k) {
                                if(_.every(level1, function(level2) {
                                    return level2.selected;
                                })) {
                                    self.formlyData.authorizedItems.authorizedLevel1[k] = true;
                                }
                            });
                        }, true);*/
                }
            },
            column: {
                modalTitle: '栏目',
                formFields: [{
                    label: '栏目名称',
                    key: 'columnsName',
                    placeholder: '输入栏目名称'
                }, {
                    label: '栏目 Alias',
                    key: 'configAlias',
                    placeholder: '输入栏目 Alias'
                }, {
                    label: '所属 OEM',
                    key: 'configAlias',
                    type: 'select'
                }]
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
                res = res ? res : {};
                var _authorizedOem = res.authorizedOem ? res.authorizedOem : [];
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
        $scope.$root.onSet = function(type, item, meta) {
            BeforeTransformer[type] && BeforeTransformer[type](item, meta);
            formlyHelper.openModal(FORMMAP[type], item);
        };
        $scope.$root.onEdit = $scope.$root.onSet;
        $scope.$root.onAdd = function(type) {
            formlyHelper.openModal(FORMMAP[type]);
        };
        $scope.$root.onDel = function(type, item, scope) {
            if (window.confirm('您确定要删除该资源吗？')) {
                if (type === 'oemPartner') {
                    apiHelper('del' + _.classify(type), {
                        params: {
                            configAlias: item.bdConfigDetail.configAlias
                        }
                    }).then(function() {
                        _.removeItem(item, scope[type + 'List']);
                    });
                }
                if (type === 'apiPartner') {
                    apiHelper('del' + _.classify(type), {
                        params: {
                            tokenId: item.id
                        }
                    }).then(function() {
                        _.removeItem(item, scope[type + 'List']);
                    });
                }
                if (type === 'channel') {
                    apiHelper('delOemSource', {
                        params: _.extend({}, item, {
                            configAlias: scope.formlyData.bdConfigDetail.configAlias
                        })
                    }).then(function(r) {
                        _.removeItem(item, scope.formlyData.bdSourceDetails);
                    });
                }
            }
        };
    });
});