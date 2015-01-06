define([
    'base/services/pmtNotice', // 类 window.alert， 还有 open-api 用的 http feedback indicator 等
    'base/services/pmtBusy', // 不太好用的 异步操作的 busy indicator
    'base/services/pmtTopNotice' // 页面顶部的通知条（如放假通知等）
], function() {
    'use strict';
    angular.module('pmtServices', ['pmtNotice', 'pmtBusy', 'pmtTopNotice'])
        .factory('downloadFile', function() {
            return function downloadFile(url) {
                var iFrame = $('#download-file-iframe');
                if (!iFrame.length) {
                    iFrame = $('<iframe id="download-file-iframe" style="position:fixed;display:none;top:-1px;left:-1px;"/>');
                    $('body').append(iFrame);
                }
                iFrame.attr('src', url);
            }
        })
        .factory('$exceptionHandler', ['$log',
            function($log) {
                return function(exception, cause) {
                    $log.error.apply($log, arguments);
                    window.Bugsnag && Bugsnag.notifyException(exception, {
                        diagnostics: {
                            cause: cause
                        }
                    });
                };
            }
        ])
        .run(function() {
            // add a simple google translate for foreign user
            if (navigator && navigator.language && !~navigator.language.indexOf('zh')) {
                $('body').prepend($('<div id="google_translate_element" style="position:absolute;right:0"></div><script type="text/javascript">function googleTranslateElementInit() {  new google.translate.TranslateElement({pageLanguage: "zh-CN", layout: google.translate.TranslateElement.InlineLayout.SIMPLE, gaTrack: true, gaId: "UA-15790641-48"}, "google_translate_element");}</script><script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>'));
            }
            // add compatible check and notice
            if (navigator && navigator.userAgent && (navigator.userAgent.indexOf('Chrome') === -1)) {
                var downloadUrl = 'http://pan.baidu.com/s/1bnnKtif';
                if (navigator.appVersion.indexOf("Mac") > -1) {
                    downloadUrl = 'http://pan.baidu.com/s/1sjrv9bJ';
                }
                $('body').prepend('<p style="text-align:center;color: red">您使用的浏览器可能存在兼容性问题，建议您使用&nbsp;<a href="<downloadUrl>" target="_blank">Chrome</a>&nbsp;来更好的使用开发者服务。</p>'.replace('<downloadUrl>', downloadUrl));
            }
        });
});