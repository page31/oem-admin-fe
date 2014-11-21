define(['routes', 'base/index'], function(routeInfo) {

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

        'pmtBase'
    ]);
    oemApp.config(function($stateProvider, $urlRouterProvider) {
        // routeHelper
        var routeHelper = {
            templateUrlForChild: 'templates/{0}/{1}.html',
            configChild: function(parent, children) {
                _.each(children, function(i) {
                    i.state = parent + '.' + i.id;
                    $stateProvider.state(i.state, {
                        url: i.url || '/' + i.id,
                        templateUrl: i.templateUrl || routeHelper.templateUrlForChild.supplant([parent, i.id]),
                        controller: parent + _.classify(i.id) + 'Ctrl'
                    });
                });
            }
        };
        var systemMenuList = [{
            name: '管理 OEM / API',
            id: 'partner'
        }, {
            name: '管理账户权限',
            id: 'account'
        }, {
            name: '检测 API 状态',
            id: 'status'
        }, {
            name: '查看日志',
            id: 'log'
        }, {
            name: '管理 OEM 栏目',
            id: 'column'
        }];

        window.systemMenuList = systemMenuList;

        // Menus: for app-vertical, data etc

        _.each(routeInfo, function(opt, name) {
            $stateProvider.state(name, opt);
        });
        routeHelper.configChild('system', systemMenuList);

        $urlRouterProvider.otherwise('/system');
    }).controller('systemCtrl', function($scope) {
        // extract to i18n
        $scope.menuList = systemMenuList;
    });

    oemApp.directive('sTable', function() {
        return {
            templateUrl: 'templates/_tpls/data-table.html',
            restrict: 'EA',
            scope: {
                dataList: '=rowList',
                headList: '='
            },
            replace: true,
            link: function() {
                console.log('fdafdas');
            }
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

    oemApp.controller('systemPartnerCtrl', function($scope) {
        // $scope.tableHead = ;
        $scope.tableData = [
            ['联想', 'Lneno', '3', 4],
            ['联想', 'Lneno', '3', 5]
        ];
    });

    oemApp.controller('systemAccountCtrl', function($scope) {
        // $scope.tableHead = ;
        $scope.tableData = [
            ['daniel@wandoujia.com', ' 内部运营', '无', 4],
            ['daniel@wandoujia.com', ' 内部运营', '无', 5]
        ];
    });

    oemApp.controller('systemStatusCtrl', function($scope) {
        // $scope.tableHead = ;
        $scope.tableData = [
            ['搜索接口', 5000, 4222, '49min'],
            ['搜索接口', 5000, 4222, '9min']
        ];
    });

    oemApp.controller('systemLogCtrl', function($scope) {
        // $scope.tableHead = ;
        $scope.tableData = [
            ['2014年11月21日', 'daniel@wandoujia.com', '可根据时间查询账户操作日志内容,时间默认选择当天'],
            ['2014年11月21日', 'daniel@wandoujia.com', '可根据时间查询账户操作日志内容,时间默认选择当天']
        ];
    });

    oemApp.controller('systemColumnCtrl', function($scope) {
        // $scope.tableHead = ;
        $scope.tableData = [
            ['华硕', '华硕周周 Zen 项', '']
        ];
    });

    angular.bootstrap(document, ['oemApp']);
});