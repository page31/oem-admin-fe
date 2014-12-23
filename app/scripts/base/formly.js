define([], function(rules) {

    /*
        Todo: 整合多余的代码， 引入 validator 了， 引入 edit, 引入 pre/after hook，引入更多 widget
        Todo: watcher? 部分组件的异步数据初始化等 - 更 fluent API
    */


    // extend underscore functionality
    _.capitalize = function(str) {
        return str[0].toUpperCase() + str.slice(1);
    };

    _.slugify = function(name) {
        // need fix no need to capital
        return name[0].toUpperCase() + name.slice(1)
            .replace(/[-_\s]([a-z])/ig, function(all, letter) {
                return letter.toUpperCase();
            });
    };

    _.deSlugify = function(name) {
        return name.replace(/[A-Z]/g, function(letter) {
            return '-' + letter.toLowerCase();
        })
    };

    /*
        input:
        select
        raido
        custom element

        {
            key: 'comment',
            type: 'textarea',
            attrs: {
                range: '4,30',
                'text-area-elastic': true,
                'rows': '4',
                'cols': '50',

                'placeholder': "(选填) 例 url_normalize like '/explore/%'",
                validator: 'optional',
                range: '4,30'
            }
        }

        metricTypeField: {
            type: 'select',
            label: 'Metric Type',
            key: 'type',
            optionStr: 'idx as opt for (idx, opt) in options.options',
            options: ['int', 'float', 'percent'],
            attrs: {
                validator: 'required'
            }
        }

        modifyTimeField: {
            key: 'modifyTime',
            label: 'Modified Time',
            attrs: {
                disabled: true
            }
        }

        {
            label: '行列转置',
            controlTpl: 'report/modal/transform-relation.html'
        }

        {
            controlHtml: '<div multi-chooser choices-list="dimensionList" ng-show="!formlyData.isChainSupport"></div><span ng-show="formlyData.isChainSupport">设置行列转置后，无法选择</span>',
            label: 'Dimension'
        }

    */

    'use strict';

    function noop() {}
    // 'base/services/validator'
    function formlyField($http, $compile, $templateCache, $timeout) {

        function getTemplateUrl(type) {
            // Todo More Input Type Widget
            var templateUrl = 'templates/_tpls/formly-field.html';
            return templateUrl;
        }

        function notFoundTypeTpl(type) {
            console.log('Formly Error: template type \'' + type + '\' not supported.');
        }
        var defaultNgOptionStr = 'opt as opt.name for opt in options.options';

        /*
            placeholder 可以 false掉或者over written, 默认是 label 值
            label 默认是 key 的slugify值
            options 和 type=select 是重复的？
        */
        return {
            restrict: 'AE',
            replace: true,
            scope: false,
            link: function fieldLink($scope, $element, $attr) {
                $scope.options = $scope.$eval($attr.options);
                var formKey = $element.parents('div-form').attr('key') + 'Data';

                // shortcut for hook referTpl
                var _ctrl;
                if ($scope.options.referTpl) {
                    $element.html($templateCache.get($scope.options.referTpl));
                    $compile($element.contents())($scope);
                    $timeout(function() {
                        _ctrl = $element.find('input,textarea,select').data("$ngModelController");
                        _ctrl && $scope[$scope.formName].$addControl(_ctrl);
                    }, 500);
                    return;
                }

                if (!$scope.options.label) {
                    $scope.options.label = $scope.options.key;
                }

                if ($scope.options.controlTpl || $scope.options.controlHtml) {
                    var controlHtml = $scope.options.controlHtml ?
                        $scope.options.controlHtml :
                        $templateCache.get($scope.options.controlTpl);

                    $element.html($templateCache.get('formly/basic-field-tpl')
                        .replace('PLACEHOLDER', controlHtml));
                    if ($scope.options.wrapAttr) {
                        $element.find('.control-group').attr($scope.options.wrapAttr);
                    }
                    $compile($element.contents())($scope);
                    $timeout(function() {
                        _ctrl = $element.find('input,textarea,select').data("$ngModelController");
                        _ctrl && $scope[$scope.formName].$addControl(_ctrl);
                    }, 500);
                    return;
                }

                if ($scope.options.options) {
                    $scope.options.type = 'select';
                }

                var templateUrl = getTemplateUrl($scope.options.type);
                if (!templateUrl) return notFoundTypeTpl($scope.options.type);

                var $input, $msg;
                $http.get(templateUrl, {
                    cache: $templateCache
                }).success(function(data) {
                    $element.html(data);
                    var type = $scope.options.type;
                    if ('input,select,textarea'.indexOf(type) === -1) {
                        type = 'input';
                    }
                    $input = $element.find(type)[0];
                    $input.setAttribute('ng-model', formKey + '.' + $scope.options.key);
                    $input.setAttribute('name', $scope.options.key);
                    if ($input && $scope.options.validate) {
                        angular.forEach($scope.options.validate, function(val, key) {
                            $input.setAttribute('ng-' + key, val);
                        });
                    }
                    if ($scope.options.type === 'select') {
                        $input.setAttribute('ng-options', $scope.options.optionStr || defaultNgOptionStr);
                    }
                    // && $scope.options.attrs
                    if ($input) {
                        // default required, how to shutdown
                        angular.forEach(_.extend({
                            validator: 'required'
                        }, $scope.options.attrs), function(val, key) {
                            $input.setAttribute(_.deSlugify(key), val);
                        });
                        if ($scope.options.placeholder) {
                            $input.setAttribute('placeholder', $scope.options.placeholder);
                        }
                    }
                    $compile($element.contents())($scope);
                    $timeout(function() {
                        $scope[$scope.formName].$addControl(
                            $element.find('input,textarea,select').data("$ngModelController")
                        );
                    }, 500);
                });
            },
            controller: function fieldController($scope) {
                return;
                $scope.options = $scope.optionsData();
                if ($scope.options['default']) {
                    $scope.value = $scope.options.
                    default;
                }

                // set field id to link labels and fields
                $scope.id = $scope.options.key;
            }
        };
    }

    function formlyForm($compile) {
        return {
            restrict: 'AE',
            templateUrl: 'templates/_tpls/formly-form.html',
            replace: true,
            scope: true,
            priority: 101,
            compile: function(tElem, tAttr) {
                return function($scope, $elem, $attr) {
                    $scope.fields = $scope.$eval($attr.fields);
                    var name = $attr.key || 'formly';
                    // before form directive init(because dynamic name)

                    if (!$scope[name + 'Data']) $scope[name + 'Data'] = {};
                    var realFormStr = $elem[0].outerHTML.replace(/div-form/g, 'form').replace('<name>', name);
                    $compile(realFormStr)($scope);
                    // $rootScope.$emit('formly.formReady');
                }
            }
        };
    }

    function capitalize() {
        return function(name) {
            if (!_.isString(name)) return name;
            return name.charAt(0).toUpperCase() + name.slice(1);
        }
    }

    // 'validation', 'validation.rule'
    angular.module('formly', ['ui.bootstrap'])
        .directive('formlyField', formlyField)
        .directive('formlyForm', formlyForm)
        .factory('formlyHelper', function($modal, $rootScope) {
            return {
                openModal: function(opt, instance, ex) {
                    if (!ex) ex = {};
                    // formFields, submit, formName, modalTitle
                    var opt = _.clone(opt);
                    var $scope = $rootScope.$new();
                    var titlePre = instance ? '修改' : '添加';
                    $scope._editType = instance ? 'edit' : 'add';
                    opt.modalTitle = titlePre + opt.modalTitle;
                    _.each(opt, function(val, k) {
                        $scope[k] = val;
                    });
                    $scope.formName = 'formly';
                    if (instance) {
                        $scope.formlyData = _.clone(instance);
                        $scope._raw = instance;
                    } else {
                        $scope.formlyData = {};
                    }
                    $scope.submit = opt.submit ? opt.submit.bind($scope, ex) : noop;
                    if (opt.initCb) {
                        opt.initCb.call($scope, ex);
                    }

                    $scope._modal = $modal.open({
                        templateUrl: 'templates/_base/modal.html',
                        size: 'lg',
                        scope: $scope // set dynamically
                    });
                }
            }
        })
        .filter('capitalize', capitalize)
        .run(function($templateCache) {
            $templateCache.put('formly/basic-field-tpl',
                '<div class="control-group">\n' +
                '    <label class="control-label" for="{{options.key}}">\n' +
                '        {{options.label|capitalize}} {{options.required ? \'*\' : \'\'}}\n' +
                '    </label>\n' +
                '    <div class="controls">PLACEHOLDER</div>\n' +
                '</div>'
            );
        });

    /*.directive('formlySubmit', ['$injector',
            function($injector) {

                var $validationProvider = $injector.get('$validation'),
                    $timeout = $injector.get('$timeout'),
                    $parse = $injector.get('$parse');

                return {
                    priority: 1, // execute before ng-click (0)
                    terminal: true,
                    link: function postLink(scope, element, attrs) {

                        $timeout(function() {
                            element.on('click', function(e) {
                                e.preventDefault();
                                var form = scope.$$childHead[attrs.formlySubmit];
                                if (!form && attrs.target) {
                                    // quick fix: tabset
                                    form = $('#' + attrs.target).scope().$$childTail[attrs.formlySubmit];
                                }
                                $validationProvider.validate(form).success(function() {
                                    if (attrs.target) {
                                        $parse(attrs.ngClick)($('#' + attrs.target).scope());
                                    } else {
                                        $parse(attrs.ngClick)(scope);
                                    }
                                });
                            });
                        });

                    }
                }
            }
        ])*/
    /*.config(function($validationProvider) {
            $validationProvider.setErrorHTML(function(msg) {
                return "<p class=\"i-form-help-block\"><span class=\"w-text-warning\">" + msg + "</span></p>";
            });

            $validationProvider.setExpression(rules.expression).setDefaultMsg(rules.defaultMsg);
            $validationProvider.showSuccessMessage = false;

            $validationProvider.checkValid = function(form) {
                for (var k in form) { // whole scope
                    if (form[k] && form[k].hasOwnProperty('$dirty')) {
                        if (!form[k].$valid) return false;
                    }
                }
                return true;
            };
        })*/
});