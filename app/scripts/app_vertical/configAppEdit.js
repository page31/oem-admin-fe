define(function() {
    var app = angular.module('appVerticalApp.configApp', []);

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

    app.controller('configAppEditCtrl', function($scope, apiHelper, $upload, $state, $q) {

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
        vm.screenshotsPreview = _.pluck(appInfo.screenshotsInfo, 'originalUrl');
        $scope.vm = vm;

        // vm and data @ scope
        console.log($scope.$root._app);
        // upload wrapp

        function setImgUpload(key, endpoint, succ, opt) {

            function noop() {
                return true
            }
            opt = _.extend({}, {
                checker: noop,
                errMsg: ''
            }, opt);
            var checker = opt.checker;
            var errMsg = opt.errMsg;

            function readImg(file) {
                var deferred = $q.defer();
                var fileReader = new FileReader();

                fileReader.onloadend = function() {
                    var img = new Image();
                    img.onload = function() {
                        deferred.resolve({
                            dataUrl: fileReader.result,
                            width: img.width,
                            height: img.height,
                            size: file.size,
                            name: file.name,
                            type: file.type
                        });
                    };
                    img.src = fileReader.result;
                };

                fileReader.readAsDataURL(file);
                return deferred.promise;
            }

            function uploadImg(f) {
                var fd = new FormData();
                fd.append('file', f);
                fd.append('configAlias', $scope.currentConfig.alias);
                return apiHelper(endpoint, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                });
            }

            function trigger(f, idx) {
                readImg(f).then(function(imgInfo) {
                    if (checker(imgInfo)) {
                        if (!_.isUndefined(idx)) {
                            $scope.vm[key + 'Preview'] = $scope.vm[key + 'Preview'] || [];
                            $scope.vm[key + 'Preview'].push(imgInfo.dataUrl);
                        } else {
                            $scope.vm[key + 'Preview'] = imgInfo.dataUrl;
                        }
                        return uploadImg(f);
                    } else {
                        $scope.vm[key + 'Err'] = errMsg;
                    }
                }).then(function(resp) {
                    if (!resp) return;
                    if (idx) {
                        succ(resp, idx);
                    } else {
                        succ(resp);
                    }
                });
            }

            $scope.$watch('vm.' + key, function(v) {
                if (!v) return;
                $scope.vm[key + 'Err'] = '';
                if (v.length) {
                    if (opt.fileLengthCheck && !opt.fileLengthCheck(v.length)) {
                        $scope.vm[key + 'Err'] = errMsg;
                        return;
                    }
                    _.each(v, function(i, idx) {
                        trigger(i, idx);
                    });
                } else {
                    trigger(v);
                }
            });
        }

        setImgUpload('icon', 'setAppIcon', function(resp) {
            $scope.appInfo.newIcon = resp.storageKey;
        }, {
            checker: function(info) {
                if (info.width === info.height && info.height === 512) {
                    if (info.type === 'image/png') return true;
                }
                return false;
            },
            errMsg: '分辨率或格式不符合'
        });

        setImgUpload('screenshots', 'setScreenshot', function(resp, idx) {
            if (!idx) {
                $scope.appInfo.newScreenshots = [];
            }
            $scope.appInfo.newScreenshots.push(resp.storageKey);
        }, {
            fileLengthCheck: function(length) {
                if (length >= 4) {
                    return true;
                }
            },
            errMsg: '至少4张截图'
        });

        $scope.submitHandler = function() {
            console.log($scope.appInfo);
            delete $scope.appInfo.iconInfo;
            delete $scope.appInfo.screenshotsInfo;
            apiHelper('confirmReplaceApp', {
                data: {
                    oemAppData: $scope.appInfo
                }
            }).then(function() {
                $state.go('appVertical.oemAppReplace');
            });
        };
    });
});