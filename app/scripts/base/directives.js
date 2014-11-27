define([
    'base/directives/pmtFormValidation', // 表单验证相关
    'base/directives/pmtPartial', // devcenter 常用的 partial - topnav, footer, avator etc
    'base/directives/pmtTextareaElastic', // 弹性文本框
    'base/directives/pmtDatePicker', // 日期选择器
    'base/directives/pmtUploadDirectives' // fineuploader 包装后的上传按钮
], function() {
    'use strict';
    // we need make these directive as pmtDirective's dependencies
    angular.module('pmtDirectives', ['pmtFormValidation', 'pmtPartial', 'pmtTextareaElastic', 'pmtDatePicker', 'pmtUploadDirectives'])
        .directive('stepBar', [

            function() {
                return {
                    restrict: 'AE',
                    replace: true,
                    scope: {
                        stepnum: '=',
                        steps: '@'
                    },
                    template: '<div class="pmt-step-progress-bar" ng-class="stepnum">' +
                        '<div class="step-status status-{{$index+1}}" ng-repeat="i in stepArray track by $index">' +
                        '<p class="step-status-title">{{i}}</p><i class="step-status-icon"></i></div>' +
                        '<div class="step-solid-line"><div class="step-success-line"></div></div>' +
                        '</div>',
                    link: function(scope, elem, attrs) {
                        scope.$watch('steps', function(val) {
                            if (!val) {
                                return;
                            }
                            scope.stepArray = eval(scope.steps);
                        })
                    }
                };
            }
        ])
        .directive('pager', [

            function() {
                return {
                    restrict: 'EA',
                    scope: {
                        pagedata: '='
                    },
                    replace: true,
                    template: '<div class="pmt-pagination"></div>',
                    link: function(scope, elem, attrs) {
                        scope.$watch('pagedata', function() {
                            var pagedata = scope.pagedata;
                            var pagerStr = '';
                            var linkTpl = '<a href="HREF" CLASS>TEXT</a>';
                            var omitTpl = '<span>&nbsp;・・・&nbsp;</span>';
                            angular.forEach(pagedata, function(value, key) {
                                if (value.type === 'link') {
                                    pagerStr += linkTpl
                                        .replace('HREF', value.href)
                                        .replace('TEXT', value.text);
                                    if (value.xclass) {
                                        pagerStr = pagerStr.replace('CLASS', 'class="' + value.xclass + '"');
                                    } else {
                                        pagerStr = pagerStr.replace('CLASS', '');
                                    }
                                } else {
                                    pagerStr += omitTpl;
                                }
                            });
                            elem.html(pagerStr);
                        });
                    }
                };
            }
        ])
        .directive('pmtPopup', [

            function() {
                return {
                    restrict: 'C',
                    link: function(scope, elem, attrs) {
                        if (attrs.popupMode === 'modal') {
                            return;
                        }
                        elem.on('click', function(e) {
                            if (e.target !== this) return;
                            scope.$root.isShowFinInfoEditor = false;
                            scope.$apply();
                        });
                        $(document).keyup(function(e) {
                            if (e.keyCode == 27) {
                                scope.$root.isShowFinInfoEditor = false;
                                scope.$apply();
                            }
                        });
                    }
                };
            }
        ])
        .directive('httpPrefix', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, controller) {
                    function ensureHttpPrefix(value) {
                        // Need to add prefix if we don't have http:// prefix already AND we don't have part of it
                        if (value && !/^(http):\/\//i.test(value) && 'http://'.indexOf(value) === -1) {
                            controller.$setViewValue('http://' + value);
                            controller.$render();
                            return 'http://' + value;
                        } else
                            return value;
                    }
                    controller.$formatters.unshift(ensureHttpPrefix);
                    controller.$parsers.unshift(ensureHttpPrefix);
                }
            };
        })
        .directive('dropdown', [

            function() {
                return {
                    link: function(scope, elem, attrs) {
                        var $dropdown = $(elem).find('.dropdown-menu').hide();
                        // for logout etc
                        $(elem).find('.btn-dropdown').on('mouseenter', function() {
                            $dropdown.show();
                        }).on('mouseleave', function() {
                            $dropdown.hide();
                        });
                    }
                };
            }
        ])
        .directive('pmtInclude', ['$http', '$templateCache', '$compile',
            function($http, $templateCache, $compile) {
                // quick fix for ng-include without create a new scope
                // let you quick move popup etc into separate file
                return function(scope, element, attrs) {
                    var templatePath = attrs.pmtInclude;
                    $http.get(templatePath, {
                        cache: $templateCache
                    }).success(function(response) {
                        var contents = element.html(response).contents();
                        $compile(contents)(scope);
                    });
                };
            }
        ]);
});