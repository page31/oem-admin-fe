define([], function() {
    function apiHelper($http) {
        var _maps = {},
            _urlPrfix = '';

        function _buildUrl(toUrl, params) {
            if (!params) return toUrl;

            _.each(params, function(val) {
                if (toUrl.indexOf('/:') > -1) {
                    toUrl = toUrl.replace(/\/:[^/]+/, '/' + val);
                } else {
                    toUrl = toUrl + '/' + val;
                }
            });
            return toUrl;
        }

        // endpont[, url part arr][,data/params][,opt]
        function helper(endpoint, opt) {
            arguments = _.toArray(arguments);
            var _api = _maps[arguments.shift()];
            if (!_api) throw new Error('Endpint ' + endpoint + 'Does Not Exist!');
            if (_.isObject(_.last(arguments))) {
                opt = arguments.pop();
            } else {
                opt = {};
            }
            if (_.isObject(_.last(arguments))) {
                if (/(DELETE)|(GET)/.test(_api.method)) {
                    opt.params = arguments.pop();
                } else {
                    opt.data = arguments.pop();
                }
            }

            return $http(_.extend({
                method: _api.method,
                url: _buildUrl(_api.url, arguments),
            }, opt));
        }

        helper.config = function(maps, opt) {
            var _prefix = _urlPrfix;
            if (opt && opt.urlPrefix) {
                _prefix = opt.urlPrefix;
            }
            _.each(maps, function(apiStr, key) {
                maps[key] = {
                    method: apiStr.split(' ')[0],
                    url: _prefix + apiStr.split(' ')[1]
                };
            });
            _maps = _.extend(_maps, maps);
        };

        helper.getUrl = function(endpoint) {
            arguments = _.toArray(arguments);
            var _api = _maps[arguments.shift()];
            return _buildUrl(_api.url, arguments)
        };

        return helper;
    }

    // 'muceApp.base.services.notice'
    angular.module('siva.apiUtilities', [])
        .factory('apiHelper', ['$http', apiHelper])
        .factory('apiHelperInterceptor', function($q, $location, $rootScope) {

            function requestHandler(config) {
                if (config.url.indexOf('templates') === -1) {
                    var _params = $location.search();
                    config.params = _.extend({}, $location.search(), config.params);
                }
                return config;
            }

            function responseErrorHandler(response) {
                try {
                    $rootScope._errMsg = 'status-' + response.status + ': ' + (response.config.url || '') + '<br>' + (response.data.msg || ', 接口出问题啦!');
                    // $notice.error();
                } catch (e) {
                    console.log('Err in apiHelperInterceptor: ' + e);
                }
                return $q.reject(response);
            }

            function responseHandler(response) {
                // api prefix check
                if (response.config.url.indexOf('/api/') > -1) {
                    if (_.contains(['PUT', 'POST', 'DELETE'], response.config.method)) {
                        // $notice.success('操作成功！');
                    }
                    return response.data;
                }
                return response;
            }

            return {
                request: requestHandler,
                responseError: responseErrorHandler,
                response: responseHandler
            };
        })
        .config(function($httpProvider) {
            $httpProvider.interceptors.push('apiHelperInterceptor');
        });
});