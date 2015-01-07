define([], function() {
    'use strict';
    angular.module('pmtAccount', [])
        .provider('pmtAccount', [

            function() {
                var enableAutoLogin = true;
                var enableCheckDevAccount = true;
                // A chance to shut down the hasty guy...
                this.disableAutoLogin = function() {
                    enableAutoLogin = false;
                };
                this.disableCheckDevAccount = function() {
                    enableCheckDevAccount = false;
                };

                var _self = this;
                this.$get = ['$rootScope', '$q', '$http', '$timeout',
                    function($rootScope, $q, $http, $timeout) {

                        function checkDevAccount(userInfo) {
                            if ((userInfo.registerSource === "QQ") || (userInfo.registerSource === "SINA")) {
                                if (!(_.any([userInfo.emailValidated, userInfo.telephoneValidated]))) {
                                    SnapPea.Account.logoutAsync();
                                    if (confirm('您现在正在使用第三方账号登陆，基于安全考虑，请绑定邮箱或手机，点击「确认」查看操作指引。')) {
                                        location.href = 'http://developer.wandoujia.com/apps/faq/#1';
                                    } else {
                                        location.href = 'http://developer.wandoujia.com';
                                    }
                                    return;
                                }
                            }
                            if (_.any([$rootScope.account.emailValidated, $rootScope.account.telephoneValidated])) {
                                $rootScope.account.nick = $rootScope.account.nick.slice(0, 20);
                            } else {
                                if ($rootScope.account.telephone) {
                                    SnapPea.AccountHook.openAsync('activate').then(function(resp) {
                                        if (resp.isLoggedIn) {
                                            location.reload();
                                        }
                                    });
                                } else {
                                    SnapPea.AccountHook.openAsync('activate-email').then(function(resp) {
                                        if (resp.isLoggedIn) {
                                            location.reload();
                                        }
                                    });
                                }
                                return;
                            }
                        }

                        return {
                            autoLogin: function() {
                                if (enableAutoLogin) {
                                    SnapPea.AccountHook.checkAsync().then(function(resp) {
                                        var userInfo = resp.data;
                                        $rootScope.account = userInfo;
                                        $rootScope.hasAuthed = true;
                                        if ($rootScope.$$phase == '$apply') return;
                                        if ($rootScope.$$phase == '$digest') return;
                                        $rootScope.$apply();
                                    }).fail(function() {
                                        SnapPea.AccountHook.openAsync('login').then(function(resp) {
                                            if (resp.isLoggedIn) {
                                                location.reload();
                                            }
                                        }, function() {
                                            // user close the popup window
                                        });
                                    });
                                }
                            },
                            logout: function() {
                                SnapPea.Account.logoutAsync();
                                $timeout(function() {
                                    location.href = 'http://developer.wandoujia.com';
                                }, 1000);
                            },
                            changePwd: function() {
                                SnapPea.AccountHook.openAsync('password').then(function(resp) {
                                    if (resp.isLoggedIn) {}
                                });
                            }
                        };
                    }
                ];
            }
        ])
        .run(['pmtAccount',
            function(pmtAccount) {
                pmtAccount.autoLogin();
            }
        ]);
});