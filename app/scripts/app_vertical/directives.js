define([], function() {
    'use strict';

    angular.module('appVerticalApp.directives', [])
        .directive('fileModel', ['$parse',
            function($parse) {
                return {
                    restrict: 'A',
                    link: function(scope, element, attrs) {
                        var model = $parse(attrs.fileModel);
                        var modelSetter = model.assign;

                        element.bind('change', function() {
                            scope.$apply(function() {
                                modelSetter(scope, element[0].files[0]);
                            });
                        });
                    }
                };
            }
        ])
        .directive('openPackageUpload', [

            function() {
                return {
                    priority: 10,
                    controller: ['$scope', '$rootScope', '$element', '$attrs', '$http', '$filter', '$notice',
                        function($scope, $rootScope, $elem, $attrs, $http, $filter, $notice) {
                            $scope.oemPkgNotifyHandler = function(ev) {
                                console.log(ev);
                                if (ev == 1) {
                                    $scope.channelPkgUploadStatus = '正在进行安全扫描...';
                                } else {
                                    $scope.channelPkgUploadStatus = '正在上传...' + $filter('humanBytes')(ev * $scope.channelPkgTask.totalBytes) + '/' + $filter('humanBytes')($scope.channelPkgTask.totalBytes);
                                }
                            };
                            $scope.oemPkgAddHandler = function(e, task) {
                                console.log(task);
                                $rootScope.vm.apkWarning = '';
                                $scope.channelPkgTask = task;
                            };
                            $scope.oemPkgSuccessHandler = function(resp) {
                                console.log(resp);
                                $scope.channelPkgUploadStatus = '';
                                // emit upload resp
                                if (resp.status == 0) {
                                    $scope.currentConfig.oemApks = resp.apks;
                                    $scope.channelPkgUploadStatus = '已上传成功';
                                } else {
                                    $scope.channelPkgUploadStatus = '遇到到错误，请重新上传';
                                    if (resp.status == 1 && resp.description) {
                                        $notice.error(resp.description);
                                    }
                                    if (resp.status == 2) {
                                        $notice.error('应用签名无效');
                                    }
                                }
                            };
                        }
                    ]
                };
            }
        ])
        .directive('draggable', function() {
            return function(scope, element) {
                // this gives us the native JS object
                var el = element[0];

                el.draggable = true;

                el.addEventListener(
                    'dragstart',
                    function(e) {
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('Text', this.id);
                        $(this).addClass('drag');
                        return false;
                    },
                    false
                );

                el.addEventListener(
                    'dragend',
                    function(e) {
                        $(this).removeClass('drag');
                        return false;
                    },
                    false
                );
            }
        })
        .directive('droppable', function() {
            return {
                scope: {
                    drop: '&',
                    bin: '='
                },
                link: function(scope, element) {
                    // again we need the native object
                    var el = element[0];

                    el.addEventListener(
                        'dragover',
                        function(e) {
                            e.dataTransfer.dropEffect = 'move';
                            // allows us to drop
                            if (e.preventDefault) e.preventDefault();
                            $(this).addClass('over');
                            return false;
                        },
                        false
                    );

                    el.addEventListener(
                        'dragenter',
                        function(e) {
                            $(this).addClass('over');
                            return false;
                        },
                        false
                    );

                    el.addEventListener(
                        'dragleave',
                        function(e) {
                            $(this).removeClass('over');
                            return false;
                        },
                        false
                    );

                    el.addEventListener(
                        'drop',
                        function(e) {
                            // Stops some browsers from redirecting.
                            if (e.stopPropagation) e.stopPropagation();

                            $(this).removeClass('over');
                            var srcId = e.dataTransfer.getData('Text');
                            var destId = this.id;

                            // call the passed drop function
                            scope.$apply(function(scope) {
                                var fn = scope.drop();
                                if ('undefined' !== typeof fn) {
                                    fn(srcId, destId);
                                }
                            });

                            return false;
                        },
                        false
                    );
                }
            }
        });
});