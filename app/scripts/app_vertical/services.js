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
                    subNavList: [{
                        key: 'channel',
                        name: '渠道管理'
                    }, {
                        key: 'app',
                        name: '应用管理'
                    }, {
                        key: 'recommends',
                        name: '推荐位管理',
                        description: '备注：推荐的应用包名列表，用换行分隔。'
                    }, {
                        key: 'banner',
                        name: 'Banner 管理'
                    }, {
                        key: 'forbiddenApps',
                        name: '黑名单管理',
                        description: '备注：以下应用将不会出现在应用列表中（含分类，搜索结果）；请在下面填写包名列表，用换行分隔。'
                    }, {
                        key: 'categoryTopApps',
                        name: '分类排序自定义',
                        description: '备注：以下应用将在所有的分类列表中靠前优先展示。内容请直接填写应用的包名列表，用换行分隔。'
                    }, {
                        key: 'searchTopApps',
                        name: '搜索自定义',
                        description: '备注：在搜索 API 中搜索特定关键词时，如下应用将优先靠前展现在搜索结果列表中。填写格式：包名#关键词1,关键词2，用换行分隔。例如：<br/>com.tencent.mm#微信,QQ<br/>com.tencent.mobileqq#QQ,QQ2014'
                    }, {
                        key: 'oemSpecial',
                        name: '专区管理',
                        description: '备注：以下应用将作为本ID的专区存在，仅需填写相关包名即可，用换行分隔。'
                    }]
                };
            }
        ])
        .factory('$helper', ['$configData',
            function($configData) {
                return {
                    getCurrentConfig: function(type) {
                        var currentType = _.find($configData.subNavList, function(item) {
                            return item.key === type;
                        });
                        if (!currentType) {
                            currentType = {
                                key: 'channel'
                            };
                        }
                        return currentType;
                    },
                    getConfigTextarea: function(configData, type) {
                        return configData[type];
                    }
                }
            }
        ])
        .factory('pmtHttpFeedbackInterceptor', ['$q', '$notice',
            function($q, $notice) {
                return {
                    request: function(config) {
                        // config.requestTimestamp = new Date().getTime();
                        console.log(config.url);
                        if (config.url.indexOf('/api/apps/v1/') > 0) {
                            config.url = 'http://open.wandoujia.com' + config.url.replace('//0.0.0.0:9000', '');
                        }
                        return config;
                    },
                    responseError: function(response) {
                        if (response.config.url !== '/api/finance/') {
                            $notice.error('error-' + response.status + ': ' +
                                (response.config.url || '') + ', 接口出问题啦!');
                            console.log(response);
                        }
                        return $q.reject(response);
                    },

                    // check cofig,method == post,
                    // then alert.success to notice
                    response: function(response) {
                        if (response.config.method === 'POST') {
                            $notice.success('操作成功！\n设置将在十分钟内全部生效');
                        }
                        return response;
                    }
                };
            }
        ])
        .config(['$httpProvider',
            function($httpProvider) {
                $httpProvider.interceptors.push('pmtHttpFeedbackInterceptor');
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
    /*.config(['$httpProvider',
            function($httpProvider) {
                // transform default aplication/json as x-www-form-urlencoded type according to backend api
                // Intercept POST requests, convert to standard form encoding
                $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                $httpProvider.defaults.transformRequest.unshift(function(data, headersGetter) {
                    var key, result = [];
                    for (key in data) {
                        if (data.hasOwnProperty(key)) {
                            if (_.isObject(data[key])) {
                                data[key] = JSON.stringify(data[key]);
                            }
                            result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
                        }
                    }
                    return result.join("&");
                });
            }
        ])*/
});