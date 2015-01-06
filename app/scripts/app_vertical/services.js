define(['base/pmtUploader', 'app_vertical/directives'], function() {
    'use strict';
    // dataService 对httpInterceptor， 对所以4xx等错误alert提示
    angular.module('appVerticalApp.services', ['pmtUploader', 'appVerticalApp.directives'])
        .factory('dataService', ['$q', '$http', '$helper', '$filter',

            function($q, $http, $helper, $filter) {
                var _cache = {};
                var fetchConfigData = function() {
                    return _getAPIData('/api/apps/v1/oem/config');
                };
                var fetchReportData = function(startDate, endDate) {
                    if (!endDate) {
                        endDate = startDate;
                        startDate = new Date();
                    }
                    return _getAPIData('/api/apps/v1/oem/report', {
                        start_date: $filter('date')(startDate, 'yyyyMMdd'),
                        end_date: $filter('date')(endDate, 'yyyyMMdd')
                    });
                };

                var fetchReportAppDownloadData = function(startDate, endDate) {
                    if (!endDate) {
                        endDate = startDate;
                        startDate = new Date();
                    }
                    return _getAPIData('/api/apps/v1/oem/reportAppsDownload', {
                        start_date: $filter('date')(startDate, 'yyyyMMdd'),
                        end_date: $filter('date')(endDate, 'yyyyMMdd')
                    });
                };

                var onCreatingConfig = false;
                var createConfig = function(id, name, configAlias) {
                    if (onCreatingConfig) return;
                    onCreatingConfig = true;
                    // /api/apps/v1/oem/config/create
                    return $http.post('/api/apps/v1/oem/config/create', {
                        sourceAlias: id,
                        sourceName: name,
                        configAlias: configAlias
                    }).then(function(resp) {
                        onCreatingConfig = false;
                    });
                };

                var onSavingBdConfig = false;
                var saveConfigData = function(config, key, val) {
                    if (onSavingBdConfig) return;
                    // /api/apps/v1/oem/config
                    var postData = _.clone(config);
                    postData[key] = val.trim().split(/\r?\n/).join('\r\n');
                    onSavingBdConfig = true;
                    $http.post('/api/apps/v1/oem/config', {
                        data: postData
                    }).then(function(resp) {
                        config[key] = val;
                        onSavingBdConfig = false;
                    });
                };

                var deleteApk = function(packageName, configAlias) {
                    // /api/apps/v1/oem/config/deleteApk
                    return $http.delete('/api/apps/v1/oem/config/deleteApk', {
                        params: {
                            packageName: packageName,
                            configAlias: configAlias
                        }
                    });
                };

                var fetchQuota = function() {
                    return _getAPIData('/api/apps/v1/oem/quota');
                };

                function _getAPIData(url, params) {
                    var serialize = function(obj) {
                        var str = [];
                        for (var p in obj)
                            if (obj.hasOwnProperty(p)) {
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            }
                        return str.join("&");
                    }
                    if (params) {
                        url = url + '?' + serialize(params);
                    }
                    var deferred = $q.defer();
                    if (_cache[url]) {
                        deferred.resolve(_cache[url]);
                    } else {
                        $http.get(url, {
                            busy: 'global'
                        }).then(function(resp) {
                            _cache[url] = resp.data;
                            deferred.resolve(resp.data);
                        });
                    }
                    return deferred.promise;
                }

                return {
                    fetchReportData: fetchReportData,
                    fetchReportAppDownloadData: fetchReportAppDownloadData,
                    fetchConfigData: fetchConfigData,
                    saveConfigData: saveConfigData,
                    fetchQuota: fetchQuota,
                    createConfig: createConfig,
                    deleteApk: deleteApk
                };
            }
        ])
        .factory('$configData', [

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
                    subNavDescMap: {
                        'recommends': '备注：推荐的应用包名列表，用换行分隔。',
                        'forbiddenApps': '备注：以下应用将不会出现在应用列表中（含分类，搜索结果）；请在下面填写包名列表，用换行分隔。',
                        'categoryTopApps': '备注：以下应用将在所有的分类列表中靠前优先展示。内容请直接填写应用的包名列表，用换行分隔。',
                        'searchTopApps': '备注：在搜索 API 中搜索特定关键词时，如下应用将优先靠前展现在搜索结果列表中。填写格式：包名#关键词1,关键词2，用换行分隔。例如：<br/>com.tencent.mm#微信,QQ<br/>com.tencent.mobileqq#QQ,QQ2014',
                        'oemSpecial': '备注：以下应用将作为本ID的专区存在，仅需填写相关包名即可，用换行分隔。'
                    }
                };
            }
        ])
        .factory('$helper', ['$configData',
            function($configData) {
                return {
                    getConfigTextarea: function(configData, type) {
                        return configData[type];
                    }
                }
            }
        ])
        .run(['pmtUploadManager', '$rootScope',
            function(pmtUploadManager, $rootScope) {
                $rootScope.$on('setApkUploader', function() {
                    // set up endpoint for uploader
                    pmtUploadManager.registerEndpoint('open.oemPkg', {
                        request: {
                            endpoint: '/api/apps/v1/oem/config/apkUpload',
                            inputName: 'file',
                            params: {
                                configAlias: window.getCurrentConfigAlias
                            }
                        },
                        validation: {
                            allowedExtensions: ['apk']
                        }
                    });
                });
            }
        ]);
});