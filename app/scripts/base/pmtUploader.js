define([], function() {
    'use strict';
    angular.module('pmtUploader', [])
        .factory('pmtUploadManager', ['$rootScope', '$q',
            function($rootScope, $q) {
                var registration = {};
                var endpoints = {};
                var tasks = {};

                function createEndpoint(endpointName, options) {
                    options = jQuery.extend(true, {
                        cors: {
                            expected: true,
                            sendCredentials: true
                        },
                        request: {
                            inputName: 'file'
                        },
                        multiple: false,
                        callbacks: {},
                        messages: {
                            typeError: '{file} 文件类型不允许。有效类型: {extensions}',
                            sizeError: '{file} 大小超过限制, 文件大小不该超过 {sizeLimit}',
                            minSizeError: '{file} 大小不够限制，文件大小至少要超过 {minSizeLimit}',
                            emptyError: '{file}为空，请重新选择后上传',
                            noFilesError: '没有文件被上传',
                            tooManyItemsError: '上传个数（{netItems}）超过限制（{itemLimit}）',
                            maxHeightImageError: '图片高度超过限制',
                            maxWidthImageError: '图片宽度超过限制',
                            minHeightImageError: '图片高度不够限制',
                            minWidthImageError: '图片宽度不够限制',
                            retryFailTooManyItems: '重试失败',
                            onLeave: '文件还没上传完, 如果现在关闭页面，上传将会被取消。'
                        }
                    }, options);

                    var endpointTasks = tasks[endpointName] = {};

                    function getTask(id) {
                        var task = endpointTasks[id];
                        if (!task) {
                            task = endpointTasks[id] = {
                                endpoint: endpointName,
                                id: id,
                                defer: $q.defer(),
                                status: 'pending'
                            };
                        }
                        return task;
                    }

                    var callbacks = _.clone(options.callbacks);
                    var delegator = jQuery({});

                    options.callbacks.onSubmitted = function(id) {
                        var file = this.getFile(id);
                        var task = getTask(id);
                        return $rootScope.$apply(function() {
                            task.totalBytes = file ? file.size : -1;
                            task.uploadedBytes = 0;
                            // ga('send', 'event', '_upload', 'add'); // stats
                            // ga('send', 'event', '_upload', 'add-endpoint', task.endpoint); // stats
                            ga('send', 'event', '_upload', 'add-totalsize', task.endpoint, task.totalBytes); // stats
                            task.startTime = (new Date()).getTime();
                            delegator.trigger('add', [task]);
                            if (callbacks.onSubmitted) {
                                return callbacks.onSubmitted.apply(null, arguments);
                            }
                        });
                    };
                    options.callbacks.onProgress = function(id, fileName, loaded, total) {
                        var task = getTask(id);
                        return $rootScope.$apply(function() {
                            task.totalBytes = total;
                            task.uploadedBytes = loaded;
                            task.defer.notify(task.totalBytes ? task.uploadedBytes / task.totalBytes : 0);
                            if (callbacks.onProgress) {
                                return callbacks.onProgress.apply(null, arguments);
                            }
                        });
                    };
                    options.callbacks.onComplete = function(id, name, responseJSON) {
                        var task = getTask(id);
                        return $rootScope.$apply(function() {
                            task.status = 'success';
                            // ga('send', 'event', '_upload', 'complete'); // stats
                            task.endTime = (new Date()).getTime();
                            ga('send', 'event', '_upload', 'complete-time', task.endpoint, (task.endTime - task.startTime)); // stats
                            task.defer.resolve(responseJSON);
                            if (callbacks.onComplete) {
                                return callbacks.onComplete.apply(null, arguments);
                            }
                        });
                    };
                    options.callbacks.onCancel = function(id) {
                        var task = getTask(id);
                        return $rootScope.$apply(function() {
                            task.status = 'canceled';
                            task.defer.reject('cancel');
                            if (callbacks.onCancel) {
                                return callbacks.onCancel.apply(null, arguments);
                            }
                        });
                    };
                    options.callbacks.onError = function(id, fileName, reason) {
                        var task;
                        return $rootScope.$apply(function() {
                            ga('send', 'event', '_upload', 'error', reason); // stats
                            // 'id' will be null if validation error happens.
                            if (id != null) {
                                task = getTask(id);
                                task.status = 'error';
                                task.defer.reject('error');
                            } else {
                                delegator.trigger('error', [reason]);
                            }
                            if (callbacks.onError) {
                                return callbacks.onError.apply(null, arguments);
                            }
                        });
                    };

                    var endpoint = endpoints[endpointName] = new fineuploader.FineUploaderBasic(options);
                    _.forEach(['on', 'off', 'trigger', 'one'], function(methodName) {
                        var boundMethod = _.bind(delegator[methodName], delegator);
                        endpoint[methodName] = function() {
                            boundMethod.apply(null, arguments);
                            return endpoint;
                        };
                    });
                    return endpoint;
                }

                return {
                    registerEndpoint: function(endpointName, options) {
                        registration[endpointName] = options;
                        return this;
                    },
                    getEndpoint: function(endpointName) {
                        var endpoint = endpoints[endpointName];
                        var options;
                        if (!endpoint) {
                            options = registration[endpointName];
                            if (options) {
                                endpoint = createEndpoint(endpointName, options);
                                delete registration[endpointName];
                            } else {
                                throw 'Unknown endpoint "' + endpointName + '"';
                            }
                        }
                        return endpoint;
                    },
                    getTasks: function(endpointName) {
                        return tasks[endpointName];
                    }
                };
            }
        ])
        .directive('pmtUploadButton', ['pmtUploadManager',
            function(pmtUploadManager) {
                return {
                    link: function($scope, $element, $attrs) {
                        var endpoint = pmtUploadManager.getEndpoint($attrs.endpoint);
                        var button = endpoint._createUploadButton({
                            element: $element[0]
                        });
                        $element.on('$destroy', function() {
                            endpoint._disposeUploadButton(button);
                            button = endpoint = null;
                        });
                    }
                };
            }
        ])
        .directive('pmtUploadDropZone', ['pmtUploadManager',
            function(pmtUploadManager) {
                return {
                    link: function($scope, $element, $attrs) {
                        var endpoint = pmtUploadManager.getEndpoint($attrs.endpoint);
                        var dropZone = new fineuploader.DragAndDrop({
                            dropZoneElements: [$element[0]],
                            callbacks: {
                                processingDroppedFiles: function() {},
                                processingDroppedFilesComplete: function(files) {
                                    endpoint.addFiles(files);
                                }
                            }
                        });

                        $element.on('$destory', function() {
                            dropZone.dispose();
                            dropZone = endpoint = null;
                        });
                    }
                };
            }
        ]);
});