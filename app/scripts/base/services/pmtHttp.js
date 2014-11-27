define([], function() {
    'use strict';
    angular.module('pmtHttp', [])
        .factory('PMT_SERVER_PATH', ['$location',
            function($location) {
                // debug mode for pmt api path, etc ?debug=test.wandoujia.com
                if ($location.search().debug) {
                    return "//" + $location.search().debug;
                }
                if ($location.host() === 'open.wandoujia-test.com') {
                    return '//' + 'open.wandoujia.com';
                }
                return '//' + window.location.host;
            }
        ])
        .factory('pmtUrl', ['PMT_SERVER_PATH',
            function(PMT_SERVER_PATH) {
                var PROTOCOL_PREFIX = /^https?\:\/\//;
                var API_PREFIX = /^\/api/;
                var API_URL_PREFIX = new RegExp('^' + PMT_SERVER_PATH + '/api');

                return {
                    // Resolve a path with pmt server.
                    resolve: function(path) {
                        // Pass if path is a url with protocol.
                        if (PROTOCOL_PREFIX.test(path)) {
                            return path;
                        }
                        // Pass if path isn't an API call.
                        if (!API_PREFIX.test(path)) {
                            return path;
                        }
                        return PMT_SERVER_PATH + path;
                    },
                    isAPI: function(url) {
                        return API_PREFIX.test(url) || API_URL_PREFIX.test(url);
                    }
                };
            }
        ])
        .factory('pmtHttpInterceptor', ['$q', 'pmtUrl', '$rootScope', '$document', 'PMT_SERVER_PATH',

            function($q, pmtUrl, $rootScope, $document, PMT_SERVER_PATH) {
                var PROTECTION_PREFIX = /^\)\]\}',?\n/;
                $rootScope.PMT_SERVER_PATH = PMT_SERVER_PATH;
                var _gaApiTimeMap = {};

                function unwrapResponse(response) {
                    var data = response.data;
                    try {
                        if (typeof data === 'string') {
                            data = JSON.parse(data.replace(PROTECTION_PREFIX, ''));
                        }
                        if (pmtUrl.isAPI(response.config.url)) {
                            if (!_.isUndefined(data.response)) {
                                response.data = data.response;
                                delete data.response;
                                response.meta = data;
                            } else {
                                response.data = data;
                                response.meta = {};
                            }
                        }
                    } catch (err) {
                        response.meta = {};
                        return response;
                    }
                }

                function resolveUrl(config) {
                    config.originUrl = config.url;
                    config.url = pmtUrl.resolve(config.url);
                    if (config.method.toUpperCase() === 'JSONP') {
                        config.url += (config.url.indexOf('?') === -1 ? '?' : '&') + 'callback=JSON_CALLBACK&_=' + (new Date().getTime());
                    }
                }

                function restoreUrl(config) {
                    if ('originUrl' in config) {
                        config.url = config.originUrl;
                        delete config.originUrl;
                    }
                }

                return {
                    request: function(config) {
                        // ga('send', 'event', '_http', 'request', config.url.replace(PMT_SERVER_PATH, '')); // stats
                        resolveUrl(config);
                        if (config.url.indexOf('/api') >= 0) {
                            // ga('send', 'event', '_http', 'api', config.url.replace(PMT_SERVER_PATH, '')); // stats
                            _gaApiTimeMap[config.url] = (new Date()).getTime();
                        }
                        if (!('withCredentials' in config)) {
                            config.withCredentials = true;
                        }

                        return config;
                    },
                    response: function(response) {
                        // ga('send', 'event', '_http', 'response', response.config.url); // stats
                        if (response.config.url.indexOf('/api') >= 0) {
                            // ga('send', 'event', '_http', 'response-time', response.config.url.replace(PMT_SERVER_PATH, ''), ((new Date()).getTime() - _gaApiTimeMap[response.config.url])); // stats
                        }
                        restoreUrl(response.config);
                        unwrapResponse(response);
                        return response;
                    },
                    responseError: function(response) {
                        restoreUrl(response.config);
                        unwrapResponse(response);
                        // ga('send', 'event', '_http', 'error-' + response.status, response.config.url.replace(PMT_SERVER_PATH, '')); // stats
                        if (location.href === '/home' && location.href === '/home/myapp') {
                            window.alert('数据加载失败，请重试!');
                        }
                        return $q.reject(response);
                    }
                };
            }
        ])
        .config(['$httpProvider',
            function($httpProvider) {
                // We'll handle response ourselves.
                $httpProvider.defaults.transformResponse.splice(0, 1);
                $httpProvider.interceptors.push('pmtHttpInterceptor');
            }
        ]);
    // debug mode for pmt api path, etc ?debug=test.wandoujia.com
    // if ($location.search().debug) {
    //     $provide.decorator('PMT_SERVER_PATH', function($delegate) {
    //         $delegate = "//" + $location.search().debug;
    //     });
    // }
});