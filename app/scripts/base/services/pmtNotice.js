define([], function() {
    'use strict';
    angular.module('pmtNotice', [])
        .controller('pmtNoticeController', ['$scope', '$attrs',
            function($scope, $attrs) {
                $scope.closeable = 'close' in $attrs;
            }
        ])
        .factory('$notice', ['$rootScope', '$timeout',
            function($rootScope, $timeout) {
                /*
                    TODO:
                    一种是不通过 directive （类 pmtIndicator, body.append）
                    一种是通过 directive (可以设定位置等)

                    Usage:
                    在指定地方放置 dir <pmt-notices>
                    在需要发起 Notice的地方, $notice.{type}(msg);
                */
                var $notice = {};
                $notice.add = function(msgObj) {
                    // alert 或者 填入到$rootScope._ctx.alerts中
                    $rootScope._notices = $rootScope._notices || [];
                    $rootScope._notices.push(msgObj);
                    $timeout(function() {
                        var idx = $rootScope._notices.indexOf(msgObj);
                        $rootScope._notices.splice(idx, 1);
                    }, 3000);
                };

                _.each(['error', 'info', 'success', 'warning'], function(type) {
                    $notice[type] = function(msg) {
                        $notice.add({
                            type: type,
                            msg: msg
                        });
                    };
                });

                return $notice;
            }
        ])
        .directive('pmtNotice', function() {
            return {
                restrict: 'EA',
                controller: 'pmtNoticeController',
                templateUrl: 'snippet/notice.html',
                transclude: true,
                replace: true,
                scope: {
                    type: '=',
                    close: '&'
                }
            };
        })
        .directive('pmtNotices', function() {
            return {
                restrict: 'EA',
                templateUrl: 'snippet/notices.html'
            };
        })
        .run(["$templateCache",
            function($templateCache) {
                $templateCache.put("snippet/notice.html",
                    "<div class='notice' ng-class='\"notice-\" + (type || \"warning\")'>\n" +
                    "    <button ng-show='closeable' type='button' class='close' ng-click='close()'>&times;</button>\n" +
                    "    <div ng-transclude></div>\n" +
                    "</div>\n");
                $templateCache.put("snippet/notices.html",
                    "<pmt-notice ng-repeat='notice in $root._notices' type='notice.type'>" +
                    "    <div>{{notice.msg}}</div>" +
                    "</pmt-notice>");
            }
        ]);
});