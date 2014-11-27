define(function() {
    angular.module('pmtTopNotice', [])
        .directive('globalMessage', ['$rootScope', '$sce',
            function($rootScope, $cookies, $sce) {
                /*
                <div global-message
                    msg="您好，豌豆荚移动广告合作协议有新的更新内容，请点击查看。 &#x2192;"
                    link="http://developer.wandoujia.com/adnetwork/agreement/"
                    expire="2014-07-04" key="0612-network-cp" ng-show="$root.routeNickName === 'report'"></div>
                */
                return {
                    template: '<div class="pmt-head-notice" ng-if="showNotice"><div class="pmt-head-notice-inner"><span ng-click="closeNoticeHandler()"><a ng-if="link" href="{{link}}" target="_blank" ng-bind-html="msg"></a><a ng-if="!link" href="#" ng-bind-html="msg"></a></span><i ng-click="closeNoticeHandler()">&times;</i></div></div>',
                    replace: true,
                    scope: {
                        msg: '@',
                        link: '@',
                        expire: '@',
                        key: '@'
                    },
                    link: function(scope, elem, attrs) {
                        scope.msg = $sce.trustAsHtml(scope.msg);
                        scope.showNotice = false;
                        if (!$cookies.noticesreaded) {
                            $cookies.noticesreaded = '';
                        }
                        // if ($cookies.noticesreaded.indexOf(scope.key) > -1) return;
                        // if (scope.expire && (new Date() > new Date(scope.expire))) return;
                        scope.showNotice = true;
                        scope.closeNoticeHandler = function() {
                            scope.showNotice = false;
                            $cookies.noticesreaded = $cookies.noticesreaded + ',' + scope.key;
                        };
                    }
                }
            }
        ])
        .factory('topNoticeMgr', ['$rootScope', '$document', '$compile',
            function($rootScope, $document, $compile) {
                // 后期尽量通过 globalMessage 来调用
                /*
                    globalMessage({
                        msg: '您好，豌豆荚移动广告合作协议有新的更新内容，请点击查看。 &#x2192;',
                        link: 'http://developer.wandoujia.com/adnetwork/agreement/',
                        expire: '2014-07-04',
                        key: '0712-network-cp'
                    });
                */
                return {
                    show: function(opt) {
                        var $dom = $('<div global-message />').attr(opt);

                        $compile($dom)($rootScope.$new(), function(clonedElement, scope) {
                            $('body').prepend(clonedElement);
                        });
                    }
                };
            }
        ]);
});