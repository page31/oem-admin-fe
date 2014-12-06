define([], function() {
    'use strict';
    angular.module('pmtPartial', [])
        .directive('account', ['$http', '$timeout',
            function($http, $timeout) {
                return {
                    restrict: 'AE',
                    replace: true,
                    scope: {
                        account: '=accountdata'
                    },
                    template: '<div class="pmt-account-field" ng-show="account">' +
                        '<img ng-src="{{ account.avatar }}" class="pmt-account-avatar">' +
                        '<div class="pmt-account-info">' +
                        '<span class="pmt-account-nickname">{{ account.nick }}</span>' +
                        '<span class="pmt-account-nickname" ng-if="$root.devUserInfo && $root.devUserInfo.preAuth">' +
                        '授权登录 - {{ $root.devUserInfo.username }}</span>' +
                        '<span class="pmt-account-email">{{ account.email }}</span></div>' +
                        '<ul class="account-dropdown-menu hide">' +
                        '<li><a href="http://www.wandoujia.com/account/settings.html" target="_self">修改账户信息</a></li>' +
                        '<li><a href="/account/info" target="_self">修改开发者信息</a></li>' +
                        '<li><a ng-click="changePwdHandler()">修改密码</a></li>' +
                        '<li><a ng-click="logoutHandler()">退出登录</a></li>' +
                        '<li ng-if="$root.devUserInfo && $root.devUserInfo.preAuth">' +
                        '<a ng-click="logoutPreAuthHandler()">退出授权登录</a></li></ul></div>',
                    link: function(scope, elem, attrs) {
                        // for logout etc
                        elem.on('mouseenter', function() {
                            $(this).find('.account-dropdown-menu').show();
                        }).on('mouseleave', function() {
                            $(this).find('.account-dropdown-menu').hide();
                        });

                        scope.logoutPreAuthHandler = function() {
                            $http.get('/api/wdj_switch_exit_user');
                            $timeout(function() {
                                location.reload();
                            }, 300);
                        };
                    }
                };
            }
        ])
        .directive('topnav', ['$timeout',

            function($timeout) {
                return {
                    restrict: 'AE',
                    replace: 'true',
                    template: '<div class="pmt-nav" ng-show="isShowTopNav">' +
                        '<ul class="main-nav">' +
                        '<li ng-repeat="link in navLinks"><a ng-href="{{link[1]}}" class="nav-item" target="_self">{{link[0]}}</a></li>' +
                        '<li ng-show="$root.devAccountFinance"><a href="/clearing" target="_self" class="nav-item">结算</a></li></ul>' +
                        '<ul class="sub-nav"><li><a href="http://developer.wandoujia.com/sdk" target="_blank" class="nav-item">SDK</a></li>' +
                        '<li><a href="http://developer.wandoujia.com/getting-started/" target="_blank" class="nav-item">帮助中心</a></li></ul></div>',
                    link: function(scope, elem, attrs) {
                        scope.$watch('$root.routePath', function(val) {
                            if (!val) return;
                            val = val.replace(/\/$/, '');
                            scope.navLinks = [
                                ['首页', '/home'],
                                ['应用', '/home/myapp'],
                                ['推广', '/ads'],
                                ['充值', '/charge'],
                                ['应用内搜索', '/ias']
                            ];
                            // 非模块首页时不显示 - scope.isShowTopNav = false;
                            var allNavs = _.map(scope.navLinks, function(item) {
                                return item[1]
                            });
                            allNavs.push('/clearing');
                            if (allNavs.indexOf(val) === -1) {
                                scope.isShowTopNav = false;
                            } else {
                                scope.isShowTopNav = true;
                            }

                            // wait scope update template
                            $timeout(function() {
                                jQuery('.pmt-nav li a').removeClass('current');
                                _.each(jQuery('.pmt-nav li a'), function(item) {
                                    item = $(item);
                                    if (item.attr('href') === val) {
                                        item.addClass('current');
                                    }
                                });
                                // 首页和我的应用在同一个模块，去掉 _blank target
                                val = val.replace(/\?.*$/, '');
                                if (val.indexOf('/home') > -1) {
                                    jQuery('.pmt-nav li').find('a').slice(0, 2).attr('target', '');
                                }
                            }, 100);
                        });
                    }
                };
            }
        ])
        .directive('footer', [

            function() {
                return {
                    restrict: 'E',
                    replace: true,
                    template: '<div class="pmt-container pmt-footer"><a href="https://devrel.zendesk.com/anonymous_requests/new" target="_blank">联系开发者客服</a>&nbsp;&nbsp;©<script>document.write(new Date().getFullYear());</script>2014豌豆实验室</div>',
                    link: function($scope, $elem, $attrs) {
                        angular.element('#block-info').hide();
                    }
                };
            }
        ]);
});