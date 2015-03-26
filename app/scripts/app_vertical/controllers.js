define([
    'app_vertical/configBanner'
], function(configBannerCtrl) {
    var app = angular.module('appVerticalApp.controllers', ['classy']);

    app.controller('configIdxCtrl', function($scope, apiHelper, $state, $configData) {
        // 全局数据：$root.authorizedOem， authorizedBean， currentConfig
        $scope.currentConfigType = '';

        function setCurrentConfig(configs, alias) {
            if (alias) {
                $scope.$root.currentConfig = _.find(configs, function(item) {
                    return item.alias === alias;
                });
            } else {
                $scope.$root.currentConfig = configs[0];
            }
        }

        $scope.changeConfType = function(type) {
            $scope.currentConfigType = type;
            $state.go('appVertical.' + type, {
                alias: $scope.currentConfig.alias
            });
        };

        apiHelper('fetchBdConfigs', {
            busy: 'global'
        }).then(function(resp) {
            setCurrentConfig(resp, $state.params.alias);
            $scope.$root.authorizedOem = resp;
        });

        $scope.handleErrResp = function(response) {
            var errTypeMap = {
                offlineError: '不存在或下线应用',
                blacklist: '黑名单应用',
                repeatError: '重复应用'
            };
            var _msg = '';
            if (response.data) {
                _.each(['offlineError', 'blacklist', 'repeatError'], function(type) {
                    if (response.data[type]) {
                        _msg += '包名中包含了' + errTypeMap[type] + ': ' + response.data[type].join(', ');
                    }
                });
            }
            $scope.apiRelatedErrMsg = _msg;
            $('<p class="w-text-warning">' + _msg + '</p>').insertBefore($('.pmt-content-wrapper form:visible .w-btn-primary'));
        };
        $scope.cleanErrMsg = function() {
            $('.pmt-content-wrapper form:visible .w-text-warning').remove();
        };
    });

    app.controller('configTopAppCtrl', function($scope, apiHelper) {
        $scope.$parent.currentConfigType = 'topApp';
        $scope.$watch('authorizedBean.authorizedLevel2.topApp', function(val) {
            if (!val) return;
            $scope.topAppType = val[0];
        });

        function callFn() {
            if ($scope.currentConfig && $scope.topAppType) {
                $scope.topApptextareaVal = $scope.currentConfig[$scope.tabMapping[$scope.topAppType.alias]];
            }
        }

        $scope.$watch('currentConfig.alias', callFn);
        $scope.$watch('topAppType', callFn);

        $scope.$watch('topAppType.alias', function(val) {
            var normalTip = '输入需优先展示的应用包名，以换行分隔，输入靠前的应用将相应靠前展示';
            var normalHolder = 'com.companyname.appname1\ncom.companyname.appname2';
            $scope.holderText = normalHolder;
            $scope.tipText = normalTip;
            if (val === 'categoryTabs') { // 具体分类页
                $scope.tipText = '请输入应用包名，以换行分隔，以下应用将在其所在的具体分类页 (例如 新闻) 靠前展示';
            }
            if (val === 'searchTopApps') { // 搜索结果
                $scope.tipText = '请输入应用包名及搜索关键词，格式为 包名#关键词1,关键词2，每项之间以换行分隔；用户输入关键词时，此包名应用将靠前优先展示';
                $scope.holderText = 'com.companyname.appname1#关键词1,关键词2\ncom.companyname.appname2#关键词1,关键词2';
            }
        });

        // 检查包名输入错误，请重新输入
        $scope.setTopApp = function() {
            $scope.cleanErrMsg();
            apiHelper('setConfigVal', {
                data: {
                    configAlias: $scope.currentConfig.alias,
                    tabAlias: $scope.topAppType.alias,
                    content: $scope.topApptextareaVal
                }
            }).then(function() {
                // update bdconfigs data & currentConfig
                $scope.currentConfig[$scope.tabMapping[$scope.topAppType.alias]] = $scope.topApptextareaVal;
            }, $scope.handleErrResp);
        };
    });

    app.controller('configApkCtrl', function($scope, apiHelper, $upload, $notice) {
        $scope.$parent.currentConfigType = 'oemApkReplace';
        $scope.$watch('files', function(file) {
            if (!file) return;
            $scope.apkUploadRef = $upload.upload({
                url: apiHelper.getUrl('setReplaceApk'),
                data: {
                    configAlias: $scope.currentConfig.alias
                },
                busy: 'ignore',
                feedback: 'ignore',
                file: file
            }).progress(function(evt) {
                $scope.progressSize = evt.position;
                $scope.totalSize = evt.totalSize;
            }).success(function(data, status, headers, config) {
                $scope.cleanApkUpload();
                if (data.status) {
                    $notice.warning(data.description || '上传出错啦!');
                } else {
                    $scope.currentUploadedApk = data.apk;
                }
                // handler defined here
            });
        });

        // add to bdconfig
        $scope.updateBdConfigApk = function() {
            $scope.currentUploadedApk.from = $scope.currentConfig.alias;
            apiHelper('confirmReplaceApk', {
                data: {
                    oemApkData: $scope.currentUploadedApk
                }
            }).then(function(r) {
                $scope.currentConfig.oemApks.unshift(r);
                $scope.cleanApkUpload();
            });
        };

        $scope.cleanApkUpload = function() {
            $scope.currentUploadedApk = null;
            $scope.progressSize = 0;
            $scope.totalSize = 0;
        };

        $scope.cancelApkupload = function() {
            // Todo: 停止请求
            $scope.apkUploadRef.abort();
            $scope.cleanApkUpload();
        };

        $scope.deleteApkHandler = function(app) {
            if (!window.confirm('您确定要删除该 APK 吗？')) return;
            apiHelper('delReplaceApk', {
                params: {
                    configAlias: $scope.currentConfig.alias,
                    packageName: app.packageName
                }
            }).then(function() {
                var list = $scope.currentConfig.oemApks;
                list.splice(list.indexOf(app), 1);
            });
        };
    });

    app.controller('configForbiddenCtrl', function($scope, apiHelper) {
        $scope.$parent.currentConfigType = 'forbiddenApps';
        $scope.$watch('currentConfig.alias', function(v) {
            if (!v) return;
            $scope.forbiddenTextareaVal = $scope.currentConfig.forbiddenApps;
        });

        $scope.setForiddenHandler = function() {
            $scope.cleanErrMsg();
            apiHelper('setConfigVal', {
                data: {
                    configAlias: $scope.currentConfig.alias,
                    tabAlias: 'forbiddenApps',
                    content: $scope.forbiddenTextareaVal
                }
            }).then(function() {
                // update bdconfigs data & currentConfig
                $scope.currentConfig.forbiddenApps = $scope.forbiddenTextareaVal;
            }, $scope.handleErrResp);
        };
    });

    app.controller('configColumnCtrl', function($scope, apiHelper) {
        $scope.$parent.currentConfigType = 'newFeature';

        function callFn() {
            if (!$scope.currentConfig) return;
            if (!$scope.currentBdColumn) return;
            // 提示未保存bdColumnTextareaVal?
            $scope.bdColumnTextareaVal = $scope.currentBdColumn.content;
        }
        $scope.$watch('currentConfig', function(v) {
            if (!v) return;
            if (!v.bdColumns.length) return;
            $scope.currentBdColumn = v.bdColumns[0];
        }, true);
        $scope.$watch('currentBdColumn', callFn, true);

        $scope.setColumnHandler = function() {
            $scope.cleanErrMsg();
            apiHelper('setColumn', {
                data: _.extend({}, $scope.currentBdColumn, {
                    content: $scope.bdColumnTextareaVal
                })
            }).then(function(r) {
                // update bdconfigs data & currentConfig
                console.log(r);
                $scope.currentBdColumn.content = $scope.bdColumnTextareaVal;
            }, $scope.handleErrResp);
        };
    });

    app.controller('configReplaceAppCtrl', function($scope, apiHelper, $http, $upload, $state) {
        var isReplace = false;
        $scope.$parent.currentConfigType = 'oemAppReplace';

        function pickNameFieldFromObj(obj, fields) {
            var ret = {};
            _.each(fields, function(i) {
                ret['new' + _.capitalize(i)] = obj[i];
            });
            return ret;
        }

        $scope.confirmReplaceAppHandler = function() {
            apiHelper('confirmReplaceApp', {
                data: {
                    oemAppData: _.extend({}, {
                        oldPackageName: $scope.currentCandidateApp.packageName,
                        from: $scope.currentConfig.alias
                    }, pickNameFieldFromObj($scope.currentUploadedApk, ['packageName', 'versionCode', 'versionName', 'md5', 'title', 'downloadUrl']), {
                        newDescription: $scope.currentCandidateApp.description,
                        newIcon: $scope.currentCandidateApp.iconsStr,
                        newScreenshots: $scope.currentCandidateApp.screenshotsStr
                    })
                }
            }).then(function(r) {
                isReplace = false;
                _.each($scope.currentConfig.oemApps, function(i) {
                    if (i.oldPackageName === r.oldPackageName) {
                        i = r;
                        isReplace = true;
                    }
                });
                if (!isReplace) {
                    $scope.currentConfig.oemApps.unshift(r);
                }
                $scope.currentCandidateApp = null;
                $scope.queryPackageName = '';
                $scope.cleanApkUpload();
            }, function() {

            });
        };

        $scope.queryAppHandler = function() {
            $scope.currentCandidateApp = null;
            $scope.notFoundCandidate = false;

            $http.jsonp('http://apps.wandoujia.com/api/v1/apps/' + $scope.queryPackageName + '?callback=JSON_CALLBACK', {
                feedback: 'ignore'
            }).then(function(data) {
                $scope.currentCandidateApp = data;
            }, function() {
                $scope.notFoundCandidate = true;
            });
        };

        /* Upload APK related */
        $scope.$watch('files', function(file) {
            if (!file) return;
            $scope.apkUploadRef = $upload.upload({
                url: apiHelper.getUrl('setReplaceApk'),
                data: {
                    configAlias: $scope.currentConfig.alias
                },
                busy: 'ignore',
                feedback: 'ignore',
                file: file
            }).progress(function(evt) {
                $scope.progressSize = evt.loaded;
                $scope.totalSize = evt.total;
            }).success(function(data, status, headers, config) {
                $scope.cleanApkUpload();
                if (data.status) {
                    $notice.warning(data.description || '上传出错啦!');
                } else {
                    $scope.currentUploadedApk = data.apk;
                }
                // handler defined here
            });
        });

        $scope.cleanApkUpload = function() {
            $scope.currentUploadedApk = null;
            $scope.progressSize = 0;
            $scope.totalSize = 0;
        };

        $scope.cancelApkupload = function() {
            $scope.apkUploadRef.abort();
            $scope.cleanApkUpload();
        };
        /* End APK Uploaded */

        $scope.deleteAppHandler = function(app) {
            if (!window.confirm('您确定要删除该 APP 吗？')) return;
            apiHelper('delReplaceApp', {
                params: {
                    from: $scope.currentConfig.alias,
                    oldPackageName: app.oldPackageName
                }
            }).then(function() {
                var list = $scope.currentConfig.oemApps;
                list.splice(list.indexOf(app), 1);
            });
        };

        $scope.editAppHandler = function(app) {
            $scope.$root._app = app;
            $state.go('appVertical.oemAppEdit', {
                alias: $scope.currentConfig.alias,
                packageName: app.newPackageName
            });
        };
    });

    app.controller('configAppEditCtrl', function($scope, apiHelper, $upload, $state) {

        $scope.appInfo = _.clone($scope.$root._app);

        var appInfo = {
            from: "jide",
            newDescription: "知乎日报，提供来自知乎社区（zhihu.com）的优质问答，还有国内一流媒体的专栏特稿。在中国，资讯类移动应用的人均阅读时长是 5 分钟。而在知乎日报，这个数字是. 您还可以在微博、微信公众号关注我们：@知乎 @知乎日报",
            newMd5: "7cac29e3d87d192eb65269c197b1c347",
            newPackageName: "com.solcoo.customer",
            newTitle: "回头客儿",
            newVersionCode: 7,
            newVersionName: "2.2.0",
            oldPackageName: "com.zhihu.daily.android",
            iconInfo: {
                "format": "png",
                "width": 68,
                "height": 68,
                "storageKey": "1c80a39ccb9bc0070aa7b0f476675b4a#512#512#png",
                "originalUrl": "http://img.wdjimg.com/mms/icon/v1/8/ed/16d6b85ec002599312228ee69c82ded8_78_78.png"
            },
            screenshotsInfo: [{
                "format": "jpeg",
                "width": 200,
                "height": 199,
                "storageKey": "fb4cd71f3cf53489ae950d482f554172#430#430#jpeg",
                "originalUrl": "http://img.wdjimg.com/mms/screenshot/1/31/371059fd21ab05226a067aed9bc80311_320_568.jpeg"
            }, {
                "format": "jpeg",
                "width": 200,
                "height": 199,
                "storageKey": "fb4cd71f3cf53489ae950d482f554172#430#430#jpeg",
                "originalUrl": "http://img.wdjimg.com/mms/screenshot/1/31/371059fd21ab05226a067aed9bc80311_320_568.jpeg"
            }, {
                "format": "jpeg",
                "width": 200,
                "height": 199,
                "storageKey": "fb4cd71f3cf53489ae950d482f554172#430#430#jpeg",
                "originalUrl": "http://img.wdjimg.com/mms/screenshot/1/31/371059fd21ab05226a067aed9bc80311_320_568.jpeg"
            }, {
                "format": "jpeg",
                "width": 200,
                "height": 199,
                "storageKey": "fb4cd71f3cf53489ae950d482f554172#430#430#jpeg",
                "originalUrl": "http://img.wdjimg.com/mms/screenshot/1/31/371059fd21ab05226a067aed9bc80311_320_568.jpeg"
            }]
        };

        // ovewrite
        $scope.appInfo = appInfo;
        vm = {};
        vm.iconPreview = appInfo.iconInfo.originalUrl;
        vm.screenshotPreviews = _.pluck(appInfo.screenshotsInfo, 'originalUrl');
        $scope.vm = vm;

        // vm and data @ scope
        console.log($scope.$root._app);
        // upload wrapp

        $scope.confirmReplaceAppHandler = function() {

        };
    });

    _.each([configBannerCtrl], function(ctrl) {
        app.classy.controller(ctrl);
    });
    return app;
});