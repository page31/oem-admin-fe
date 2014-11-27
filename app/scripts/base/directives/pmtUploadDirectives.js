define([], function() {
    'use strict';
    angular.module('pmtUploadDirectives', [])
        .directive('pmtFileUploadField', [
            // hardcode - endpoin属性，由于nm.key组成，如app.icon
            // 同时，rootScope下有{key}Preview和{key}Warning在命名空间
            // 真正的storageKey放在scope[{nm}][{key}]下
            function() {
                var controller = function($scope, $element, $attrs, $rootScope, pmtUploadManager) {
                    var optFromAttr = $scope.$eval($attrs.uploader) || {};
                    var endpoint = $attrs.endpoint;
                    var nm = endpoint.split('.')[0];
                    var key = endpoint.split('.')[1];
                    !$rootScope.vm && ($rootScope.vm = {});
                    pmtUploadManager.getEndpoint(endpoint).on('add', function(e, task) {
                        $rootScope.vm[key + 'Preview'] = '上传中，请稍等';
                        $rootScope.vm[key + 'Warning'] = '';
                        optFromAttr.add && optFromAttr.add(e, task);
                        task.defer.promise.then(
                            function successFn(resp) {
                                if (optFromAttr.success) {
                                    optFromAttr.success(resp);
                                    return;
                                }
                                if (resp.response) {
                                    resp = resp.response;
                                }
                                $scope[nm][key] = resp.storageKey;
                                $rootScope.vm[key + 'Preview'] = resp.url;
                            },
                            function errorFn(resp) {
                                $rootScope.vm[key + 'Preview'] = '';
                                $rootScope.vm[key + 'Warning'] = '上传失败，请检查网络或稍后再试';
                            },
                            function notifyFn(resp) {
                                optFromAttr.notify && optFromAttr.notify(resp);
                            }
                        );
                    }).on('error', function(e, errmsg) {
                        $rootScope.vm[key + 'Warning'] = errmsg;
                    });
                };

                return {
                    controller: ['$scope', '$element', '$attrs', '$rootScope', 'pmtUploadManager', controller]
                };
            }
        ])
        .directive('pmtMockUpload', [

            function() {
                return {
                    link: function($scope, $elem, $attr) {
                        $elem.on('click', function() {
                            $elem.parent().parent().find('button input')[0].click();
                        });
                    }
                };
            }
        ]);
});