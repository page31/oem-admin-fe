define([
    'app_vertical/controllers/configBanner',
    'app_vertical/controllers/configGeneral'
], function(configBannerCtrl, configGeneralCtrl) {
    var app = angular.module('appVerticalApp.controllers', ['classy']);

    var configCtrl = {
        name: 'configCtrl',
        inject: ['$scope', '$state', 'dataService', '$helper', '$configData'],
        init: function() {
            var $scope = this.$scope,
                $routeParams = this.$state.params;
            $scope.currentConfigType = this.$helper.getCurrentConfig($routeParams.type);
            $scope.switchCurrentConfig = function(i) {
                $scope.currentConfig = i;
                // TODO UPDATE URL
            };
            this.dataService.fetchConfigData().then(function(data) {
                $scope.configData = data;
                if ($routeParams.alias) {
                    $scope.currentConfig = _.find(data, function(item) {
                        return item.alias === $routeParams.alias;
                    });
                } else {
                    $scope.currentConfig = data[0];
                }
            });

            $scope.$root.subNavList = this.$configData.subNavList;
        }
    };

    var configIndexCtrl = {
        name: 'configIndexCtrl',
        inject: ['$scope', 'dataService', '$notice'],
        init: function() {
            this.$.configChannel = {};
        },
        addConfigHandler: function() {
            var $scope = this.$scope,
                configChannel = this.$scope.configChannel;
            if (configChannel.id && configChannel.name) {
                this.dataService.createConfig(configChannel.id, configChannel.name, $scope.currentConfig.alias).then(function() {
                    $scope.currentConfig.sources.push($scope.configChannel.name);
                    // cleaning up
                    configChannel.name = '';
                    configChannel.id = '';
                    $scope.isShowNewForm = false;
                });
            } else {
                this.$notice.info('请先填写渠道数据！');
            }
        }
    };

    var configAppCtrl = {
        name: 'configAppCtrl',
        inject: ['$scope', 'dataService'],
        init: function() {
            // 引入apk pmt-file-uploader
            /*
                /api/v1/oem/config/apkUpload
                content-type: multipart/form-data, [fileForm, configAlias] -> {
                    status, apks: [{id, packageName, title, downloadUrl, modification, etc}]
                }
                /api/apps/v1/oem/config/deleteApk
                {packageName, configAlias}
             */
            var $scope = this.$scope;
            $scope.$on('uploader-open.oemPkg', function(resp) {
                this.dataService.saveConfigData($scope.currentConfig, 'app', $scope.currentConfigTextarea);
                // add to apk list
            });

            window.getCurrentConfigAlias = function() {
                return $scope.currentConfig.alias;
            };
            $scope.$emit('setApkUploader');
        },
        deleteApk: function(app) {
            var $scope = this.$scope;

            this.dataService.deleteApk(app.packageName, $scope.currentConfig.alias).then(function() {
                var idx = $scope.currentConfig.oemApks.indexOf(app);
                $scope.currentConfig.oemApks.splice(idx, 1);
            });
        }
    };

    _.each([configCtrl, configAppCtrl, configIndexCtrl, configIndexCtrl, configGeneralCtrl, configBannerCtrl], function(ctrl) {
        app.classy.controller(ctrl);
    });
    return app;
});