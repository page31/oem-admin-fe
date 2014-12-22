define([], function() {
    var systemApp = angular.module('systemApp.bizCtrl', ['pmtBase']);

    systemApp.controller('systemPartnerCtrl', function($scope, apiHelper) {
        _.extend($scope.FORMMAP, {
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
                del: function(item, scope) {
                    var self = this;
                    apiHelper('delOemSource', {
                        params: _.extend({}, item, {
                            configAlias: scope.formlyData.bdConfigDetail.configAlias
                        })
                    }).then(function(r) {
                        _.removeItem(item, scope.formlyData.bdSourceDetails);
                    });
                },
                submit: function() {
                    // setOemSource
                    var self = this;
                    apiHelper('setOemSource', {
                        data: self.formlyData
                    }).then(function(r) {
                        // use ref to add updated/added res back
                        if (self._editType === 'add') {
                            // Todo: duplicate columnsAlias check
                            $scope.columnList.push(r);
                        } else {
                            _.replaceWith($scope.columnList, r, self._raw);
                        }
                        self._modal.close();
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
                del: function(item) {
                    apiHelper('delOemPartner', {
                        params: {
                            configAlias: item.bdConfigDetail.configAlias
                        }
                    }).then(function() {
                        _.removeItem(item, $scope.oemPartnerList);
                    });
                },
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
                del: function(item) {
                    apiHelper('delApiPartner', {
                        params: {
                            tokenId: item.id
                        }
                    }).then(function() {
                        _.removeItem(item, $scope.apiPartnerList);
                    });
                },
                initCb: function() {
                    var self = this;
                    /* trans _privileges */
                    var _privileges = self.formlyData.privileges;
                    self.$watch('$root.tokenMeta.candidatePrivileges', function(v) {
                        if (!v) return;
                        var ret = _.clone(v);
                        _.each(ret, function(v, k) {
                            if (_.contains(_privileges, k)) {
                                ret[k] = true;
                            } else {
                                ret[k] = false;
                            }
                        });
                        self.formlyData.privileges = ret;
                    });
                },
                submit: function() {
                    var self = this;
                    var data = _.clone(this.formlyData);
                    data.privileges = [];
                    _.each(self.formlyData.privileges, function(v, k) {
                        if (v) {
                            data.privileges.push(k);
                        }
                    });
                    apiHelper('setApiPartner', {
                        data: {
                            tokenData: data
                        }
                    }).then(function(r) {
                        if (self._editType === 'add') {
                            $scope.apiPartnerList.push(r);
                        } else {
                            _.replaceWith($scope.apiPartnerList, r, self._raw);
                        }
                        self._modal.close();
                    });
                }
            }
        });
        apiHelper('fetchTokenMeta').then(function(r) {
            $scope.$root.tokenMeta = r;
        });
        apiHelper('fetchApiPartners').then(function(r) {
            $scope.apiPartnerList = r.beans;
        });
        apiHelper('fetchOemPartners').then(function(r) {
            $scope.oemPartnerList = r.beans;
        });
    });

    systemApp.controller('systemAccountCtrl', function($scope, apiHelper, $timeout) {
        var allOemChoicesField = {
            label: '可管理的 OEM/API',
            controlTpl: 'auth/available-partner-list-snippet.html' // 异步接口数据，自定义 checkbox
        };
        var onlyOemChoiceField = {
            label: '可管理的 OEM/API',
            type: 'select',
            key: 'authorizedOem',
            optionStr: 'i as i.configName for i in $root.authMeta.authorizedOem'
        };

        $scope.FORMMAP.auth = {
            modalTitle: '账户',
            formFields: [{
                    label: '豌豆荚账户 Uid',
                    key: 'uid'
                }, {
                    label: '豌豆荚账户 Email',
                    key: 'email'
                }, {
                    label: '账户角色',
                    key: 'group',
                    type: 'select',
                    optionStr: 'i as i.name for i in $root.authMeta.groups'
                },
                allOemChoicesField, {
                    label: '开设权限',
                    controlTpl: 'auth/available-authorizeditem-list-snippet.html' // 异步接口数据，自定义 checkbox
                }
            ],
            del: function(item) {
                apiHelper('delAuth', {
                    params: {
                        uid: item.uid
                    }
                }).then(function() {
                    _.removeItem(item, $scope.authList);
                });
            },
            submit: function() {
                var self = this;
                var data = _.clone(self.formlyData);

                if (data.group.alias === 'GROUP_USER_V') {
                    data.authorizedOem = [data.authorizedOem];
                } else {
                    data.authorizedOem = _.map(_.filter(self.formlyData.authorizedOem, function(oem) {
                        return oem.selected;
                    }), function(i) {
                        return _.omit(i, 'selected');
                    });
                }
                delete data.isSelectAllOems;
                apiHelper('setAuth', {
                    data: {
                        authorityData: data
                    }
                }).then(function(r) {
                    if (self._editType === 'add') {
                        $scope.authList.push(r);
                    } else {
                        _.replaceWith($scope.authList, r, self._raw);
                    }
                    self._modal.close();
                });
            },
            initCb: function(e) {
                var self = this;
                this.$watch('formlyData.isSelectAllOems', function(val) {
                    if (_.isUndefined(val)) return;
                    _.each(self.formlyData.authorizedOem, function(i) {
                        i.selected = val;
                    });
                }, true);

                this.$watch('formlyData.group', function(val) {
                    if (!val) return;
                    if (val.alias === 'GROUP_USER_V') {
                        self.formFields[3] = onlyOemChoiceField;
                    } else {
                        self.formFields[3] = allOemChoicesField;
                    }
                });

                this.$root.$watch('authMeta.authorizedOem', function(v) {
                    if (!v) return;
                    if (self.formlyData.authorizedOem) {
                        _.each(self.formlyData.authorizedOem, function(i) {
                            var x = _.find(v, function(ii) {
                                return ii.configAlias == i.configAlias;
                            });
                            if (x) {
                                x.selected = true;
                            }
                        });
                    }
                    if (!self.formlyData.group) {
                        self.formlyData.group = $scope.$root.authMeta.groups[0];
                        self.formlyData.authorizedOem = $scope.$root.authMeta.authorizedOem;
                    } else {
                        if (self.formlyData.group.alias === 'GROUP_USER_V') {
                            self.formlyData.authorizedOem = _.find($scope.$root.authMeta.authorizedOem, function(i) {
                                return i.configAlias == self.formlyData.authorizedOem[0].configAlias;
                            });
                        } else {
                            self.formlyData.authorizedOem = v;
                        }
                        self.formlyData.group = _.find($scope.$root.authMeta.groups, function(i) {
                            return i.id == self.formlyData.group.id;
                        });
                    }
                });

                this.$root.$watch('authMeta.authorizedItems', function(v) {
                    if (!v) return;
                    if (self.formlyData.authorizedItems) return;
                    self.formlyData.authorizedItems = v;
                });

                self.selectAuthorizedLevel1 = function(k, item) {
                    item.selected = !item.selected;
                    _.each(self.formlyData.authorizedItems.authorizedLevel2[k], function(ii) {
                        ii.selected = item.selected;
                    });
                };
                self.selectAuthorizedLevel2 = function(item, parent, all) {
                    item.selected = !item.selected;

                    if (_.every(all, function(child) {
                        return child.selected;
                    })) {
                        parent.selected = true;
                    }
                    if (_.any(all, function(child) {
                        return !child.selected;
                    })) {
                        parent.selected = false;
                    }
                };
            }
        };

        apiHelper('fetchAuths').then(function(r) {
            $scope.authList = r.beans;
        });

        $scope.tableData = [
            ['daniel@wandoujia.com', ' 内部运营', '无', 4],
            ['daniel@wandoujia.com', ' 内部运营', '无', 5]
        ];
    });

    systemApp.controller('systemStatusCtrl', function($scope, apiHelper) {

        $scope.$watch('currentConfigAlias', function(val) {
            if (!val) return;
            apiHelper('fetchQuota', {
                params: {
                    configAlias: val
                }
            }).then(function(r) {
                $scope.tableData = _.map2Arr(r, ['name', 'totalCount', 'usedCount', 'nextReset']);
            });
        });
    });

    systemApp.controller('systemLogCtrl', function($scope, apiHelper, $timeout, $filter) {

        $timeout(function() {
            function updateDateRange(start, end) {
                $scope.startDate = start._d.getTime();
                $scope.endDate = end._d.getTime();
                $('#reportrange span').html(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'));
            }
            $('#reportrange').daterangepicker({
                    ranges: {
                        'Today': [moment(), moment()],
                        'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                        'Last 7 Days': [moment().subtract('days', 6), moment()],
                        'Last 30 Days': [moment().subtract('days', 29), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                    },
                    startDate: moment().subtract('days', 29),
                    endDate: moment()
                },
                function(start, end) {
                    updateDateRange(start, end);
                }
            );
            updateDateRange(moment().subtract('days', 29), moment());
            $scope.fetchLog();
        });

        $scope.fetchLog = function() {
            apiHelper('fetchLog', {
                params: {
                    startTime: $scope.startDate,
                    endTime: $scope.endDate
                }
            }).then(function(r) {
                $scope.tableData = _.map(_.map2Arr(r.beans, ['timeStamp', 'username', 'content']), function(row) {
                    row[0] = $filter('date')(row[0]);
                    return row;
                });
            });
        }
    });

    systemApp.controller('systemColumnCtrl', function($scope, apiHelper) {
        $scope.FORMMAP.column = {
            modalTitle: '栏目',
            formFields: [{
                label: '栏目名称',
                key: 'columnsName',
                placeholder: '输入栏目名称'
            }, {
                label: '栏目 Alias',
                key: 'columnsAlias',
                placeholder: '输入栏目 Alias'
            }, {
                label: '所属 OEM',
                key: 'configAlias',
                type: 'select',
                optionStr: 'i.configAlias as i.configName for i in $root.authMeta.authorizedOem'
            }],
            initCb: function() {
                var self = this;
                this.$root.$watch('authMeta.authorizedOem', function(v) {
                    if (!v) return;
                    if (self.formlyData.configAlias) return;
                    self.formlyData.configAlias = v[0].configAlias;
                });
            },
            submit: function() {
                var self = this;
                console.log(this.formlyData);
                apiHelper('setColumn', {
                    data: self.formlyData
                }).then(function(r) {
                    if (self._editType === 'add') {
                        // Todo: duplicate columnsAlias check
                        $scope.columnList.push(r);
                    } else {
                        _.replaceWith($scope.columnList, r, self._raw);
                    }
                    self._modal.close();
                });
            },
            del: function(item) {
                apiHelper('delColumn', {
                    params: {
                        columnsAlias: item.columnsAlias
                    }
                }).then(function() {
                    _.removeItem(item, $scope.columnList);
                });
            }
        };

        apiHelper('fetchColumns').then(function(r) {
            $scope.columnList = r.beans;
        });

        $scope.tableData = [
            ['华硕', '华硕周周 Zen 项', '']
        ];
    });
})