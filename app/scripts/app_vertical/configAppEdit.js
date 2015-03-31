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
                packageName: app.oldPackageName
            });
        };
    });

    app.controller('configAppEditCtrl', function($scope, apiHelper, $upload, $state, $q, $http) {
        var appInfo;

        var pn = $state.params.packageName;

        apiHelper('fetchAppDetail', {
            params: {
                packageName: pn,
                configAlias: $state.params.alias
            }
        }).then(function(resp) {
            appInfo = resp;
            if (!appInfo.newScreenshots) {
                $http.jsonp('http://apps.wandoujia.com/api/v1/apps/' + pn + '?callback=JSON_CALLBACK', {
                    feedback: 'ignore'
                }).then(function(candidate) {
                    appInfo = _.extend(appInfo, {
                        screenshotsInfo: candidate.screenshots.normal,
                        iconInfo: candidate.icons.px48,
                        first: true,
                        newDescription: candidate.description,
                        newIcon: candidate.iconsStr,
                        newScreenshots: candidate.screenshotsStr
                    });
                    init();
                });
            } else {
                init();
            }
        });

        function init() {
            // ovewrite
            vm = {};
            if (appInfo.first) {
                vm.iconPreview = appInfo.iconInfo;
                vm.screenshotsPreview = appInfo.screenshotsInfo;
                delete appInfo.first;
            } else {
                vm.iconPreview = appInfo.iconInfo.url;
                vm.screenshotsPreview = _.pluck(appInfo.screenshotsInfo, 'url');
            }
            $scope.vm = vm;
            $scope.appInfo = appInfo;
            $scope.appInfo.newScreenshots = $scope.appInfo.newScreenshots.split(',');
        }

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
                    if (!_.isUndefined(idx)) {
                        $scope.vm[key + 'Status'].processed += 1;
                        succ(resp, idx);
                    } else {
                        succ(resp);
                    }
                });
            }

            $scope.$watch('vm.' + key, function(v) {
                if (!v) return;
                $scope.vm[key + 'Err'] = '';
                if (opt.fileLengthCheck) {
                    if (opt.fileLengthCheck && !opt.fileLengthCheck(v.length)) {
                        $scope.vm[key + 'Err'] = errMsg;
                        return;
                    }
                    $scope.vm[key + 'Status'] = {
                        length: v.length,
                        processed: 0
                    };
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
            $scope.appInfo.newScreenshots.push(resp.storageKey);
        }, {
            fileLengthCheck: function(length) {
                if (length >= 4) {
                    $scope.vm['screenshots' + 'Preview'] = [];
                    $scope.appInfo.newScreenshots = [];
                    return true;
                }
            },
            errMsg: '至少4张截图'
        });

        function changeArrayItem(arr, src, dest) {
            var tmp = arr[dest];
            arr[dest] = arr[src];
            arr[src] = tmp;
        }

        $scope.dropScreenHandler = function(src, dest) {
            src = src.replace('drag-screenshot-', '');
            dest = dest.replace('drag-screenshot-', '');
            changeArrayItem(vm.screenshotsPreview, src, dest);
            changeArrayItem($scope.appInfo.newScreenshots, src, dest);
        };

        $scope.submitHandler = function() {
            console.log($scope.appInfo);
            delete $scope.appInfo.iconInfo;
            delete $scope.appInfo.screenshotsInfo;
            if (angular.isArray($scope.appInfo.newScreenshots)) {
                $scope.appInfo.newScreenshots = $scope.appInfo.newScreenshots.join(',');
            }
            apiHelper('confirmReplaceApp', {
                data: {
                    oemAppData: $scope.appInfo
                }
            }).then(function() {
                // force reload
                $state.go('appVertical.oemAppReplace');
            });
        };
    });
});