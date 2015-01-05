define([
    'app_vertical/controllers/configBanner',
    'app_vertical/controllers/configGeneral'
], function(configBannerCtrl, configGeneralCtrl) {
    var app = angular.module('appVerticalApp.controllers', ['classy']);

    app.controller('configIdxCtrl', function($scope, apiHelper, $q, $state, $configData) {
        // 全局数据：$root.authorizedOem， authorizedBean， currentConfig
        $scope.holderText = 'com.companyname.appname1\ncom.companyname.appname2';
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

        $q.all([apiHelper('fetchAppsAuth'), apiHelper('fetchBdConfigs')]).then(function(resps) {
            setCurrentConfig(resps[1], $state.params.alias);
            $scope.authorizedBean = resps[0].authorityBean.authorizedItems;
            $scope.tabMapping = resps[0].tabMapping;
            $scope.$root.authorizedOem = resps[1];
        });
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
            $scope.tipText = '输入需优先展示的应用包名，以换行分隔，输入靠前的应用将相应靠前展示';
            if (val === 'categoryTabs') { // 具体分类页
                $scope.tipText = '请输入应用包名，以换行分隔，以下应用将在其所在的具体分类页 (例如 新闻) 靠前展示';
            }
            if (val === 'searchTopApps') { // 搜索结果
                $scope.tipText = '请输入应用包名及搜索关键词，格式为 包名#关键词1，关键词2，每项之间以换行分隔；用户输入关键词时，此包名应用将靠前优先展示';
                $scope.holderText = 'com.companyname.appname1#关键词1，关键词2\ncom.companyname.appname2#关键词1，关键词2';
            }
        });

        // 检查包名输入错误，请重新输入
        $scope.updateTopApp = function() {

        };
    });

    app.controller('configApkCtrl', function($scope, apiHelper, $upload) {
        $scope.$parent.currentConfigType = 'oemApkReplace';
        $scope.$watch('myFiles', function(file) {
            if (!file) return;
            $upload.upload({
                url: apiHelper.getUrl('setReplaceApk'),
                data: {

                },
                file: file
            }).progress(function(evt) {
                console.log(evt);
            }).success(function(data, status, headers, config) {

            });
        });

        // upload apk and check
        $scope.$emit('setApkUploader');
        $scope.$on('uploader-open.oemPkg', function(resp) {
            this.dataService.saveConfigData($scope.currentConfig, 'app', $scope.currentConfigTextarea);
            // add to apk list
        });

        // add to bdconfig
        $scope.updateBdConfigApk = function() {

        };

        $scope.deleteApkHandler = function(app) {
            apiHelper('delReplaceApk', {
                params: {

                }
            }).then(function() {

            });
        };
    });

    app.controller('configBannerCtrl', function($scope, apiHelper) {

    });

    app.controller('configForbiddenCtrl', function($scope, apiHelper) {
        $scope.$parent.currentConfigType = 'forbiddenApps';
        $scope.$watch('currentConfig.alias', function(v) {
            if (!v) return;
            $scope.forbiddenTextareaVal = $scope.currentConfig.forbiddenApps;
        });

        $scope.setForiddenHandler = function() {
            apiHelper('setConfigVal', {
                data: {

                }
            }).then(function() {
                // update bdconfigs data & currentConfig
            });
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

        $scope.setForiddenHandler = function() {
            apiHelper('setColumn', {
                data: {

                }
            }).then(function() {
                // update bdconfigs data & currentConfig
            });
        };
    });

    _.each([configBannerCtrl], function(ctrl) {
        app.classy.controller(ctrl);
    });
    return app;
});