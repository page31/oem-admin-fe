window._ServerUrl = 'http://test.wandoujia.com';
require(['routes',
    'templates',
    'system/index',
    'app_vertical/index',
    'data/index'
], function(routeInfo) {

    /* Base Setup here */
    // extend underscore functionlity
    _.mixin(_.string.exports());
    // http://stackoverflow.com/questions/1408289/best-way-to-do-variable-interpolation-in-javascript
    String.prototype.supplant = function(o) {
        return this.replace(/{([^{}]*)}/g,
            function(a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };

    var oemApp = angular.module('oemApp', [
        'ngSanitize',
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'oemApp.templates',
        'systemApp',
        'appVerticalApp',
        'dataApp'
    ]);

    /* base routes defined here */
    oemApp.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/system');
    });

    oemApp.config(function(paginationConfig) {
        _.extend(paginationConfig, {
            maxSize: 6,
            itemsPerPage: 20,
            boundaryLinks: false,
            previousText: '上一页',
            nextText: '上一页'
        });
    });

    oemApp.config(function($validationProvider) {
        $validationProvider.setExpression({
            optional: function(val, scope, element, attrs) {
                return true;
            },
            uid: function(val) {
                return /^\d*$/.test(val);
            },
            email: function(val) {
                return /^.*@.*$/.test(val);
            }
        }).setDefaultMsg({
            optional: {
                error: '',
                success: ''
            },
            uid: {
                error: 'uid 格式不正确',
                success: ''
            },
            email: {
                error: '请填写正确的邮箱地址',
                success: ''
            }
        });
    });

    oemApp.run(function($state, $rootScope, apiHelper) {
        $rootScope.$state = $state;

        $rootScope.pagizHandler = function(endpoint, opts, handler, $scope, name) {

            if (!handler) {
                handler = function(r) {
                    $scope[name + 'List'] = r.beans;
                    $scope[name + 'TotalNum'] = r.totalCount;
                }
            }

            var _wrap = function(page) {
                apiHelper(endpoint, _.extend({}, opts, {
                    params: {
                        start: (+page - 1) * 20
                    }
                })).then(function(r) {
                    handler(r);
                    window.scrollTo(0, 0);
                });
            };

            $scope.$watch(name + 'Page', function(v) {
                if (!v) return;
                _wrap(v);
            });

            $scope[name + 'Page'] = 1;
        };
    });

    window.baseDateRangeInit = function($scope, init) {
        function updateDateRange(start, end) {
            $scope.startDate = start._d.getTime();
            $scope.endDate = end._d.getTime();
            $('#reportrange span').html(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'));
        }
        $('#reportrange').daterangepicker({
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                }
            },
            function(start, end) {
                updateDateRange(start, end);
            }
        );

        updateDateRange(init[0], init[1]);
    };

    oemApp.controller('idxCtrl', function(apiHelper, $scope, $rootScope, $timeout) {
        if ($rootScope.hasAuthed) {
            fetchAuth();
        } else {
            $rootScope.$watch('hasAuthed', function(v) {
                if (!v) return;
                fetchAuth();
            });
        }

        function fetchAuth() {
            $timeout(function() {
                apiHelper('fetchAppsAuth', {
                    busy: 'global'
                }).then(function(resp) {
                    $scope.authorizedBean = resp.authorityBean.authorizedItems;
                    $scope.tabMapping = resp.tabMapping;
                    $scope.authorizedGroup = resp.authorityBean.group;
                });
            }, 10);
        }

    });

    // Todo: 探索下 directive(Name 哪些会被过滤掉，attribute 大小写等)
    oemApp.directive('sTable', function() {
        return {
            templateUrl: 'templates/_tpls/data-table.html',
            restrict: 'EA',
            scope: {
                dataList: '=rowList',
                headList: '='
            },
            replace: true
        };
    });

    oemApp.directive('s', function($compile) {
        return {
            templateUrl: 'templates/_tpls/router-item.html',
            scope: {
                item: '=data'
            },
            replace: true,
            link: function($scope, $elem, $attr) {
                // $attr.$set('ui-sref', $scope.item.state);
                var link = $elem.find('a')[0];
                link.setAttribute('ui-sref', $scope.item.state);
                $compile($elem.contents())($scope);
            }
        }
    });

    angular.bootstrap(document, ['oemApp']);
});