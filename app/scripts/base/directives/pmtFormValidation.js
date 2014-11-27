define([], function() {
    'use strict';
    angular.module('pmtFormValidation', [])
        .directive('message', [

            function() {
                function getFieldValidationExpr(formName, fieldName) {
                    var fieldExpression = formName + '.' + fieldName;
                    var invalidExpression = fieldExpression + '.$invalid';
                    var dirtyExpression = fieldExpression + '.$dirty';
                    var watchExpression = invalidExpression + ' && ' + dirtyExpression;
                    return watchExpression;
                }

                function getFieldErrorExpr(formName, fieldName) {
                    var fieldExpression = formName + '.' + fieldName;
                    var errorExpression = fieldExpression + '.$error';
                    return errorExpression;
                }

                function getFieldValueChangeExpr(formName, fieldName) {
                    return formName + '.' + fieldName + '.$viewValue';
                }

                function getFieldCustErrExpr(formName, fieldName) {
                    return formName + '.' + fieldName + '._custMsg';
                }
                var msgTable = {
                    'required': '不能为空',
                    'minlength': '长度过短',
                    'maxlength': '长度过长',
                    'email': '不是合法的email'
                };

                return {
                    restrict: 'A',
                    require: '^form',
                    replace: true,
                    template: '<div class="pmt-form-help-block"></div>',
                    link: function($scope, el, attrs, ctrler) {
                        var formName = ctrler.$name;
                        var fieldName = attrs['for'];
                        var watchExpr1 = getFieldValidationExpr(formName, fieldName);
                        var watchExpr2 = getFieldErrorExpr(formName, fieldName);
                        var watchValChangeExpr = getFieldValueChangeExpr(formName, fieldName);
                        var watchCustErrExpr = getFieldCustErrExpr(formName, fieldName);

                        var field = $scope[formName][fieldName];
                        if (field) {
                            $scope[formName][fieldName]._checkShowMsg = checkShowMsg;
                        }

                        function checkShowMsg() {
                            var field = $scope[formName][fieldName];
                            var errShow, custMsg;
                            if (field) {
                                errShow = field.$invalid && field.$dirty;
                                if (field && field._custMsg) {
                                    custMsg = field._custMsg;
                                    errShow = true;
                                }
                            }

                            var html, helpstr;
                            if (errShow) {
                                el.parents('.pmt-form-row').find('label').addClass('w-text-warning');
                                el.parents('form').find('[name=' + fieldName + ']').addClass('pmt-form-danger');
                            } else {
                                el.parents('.pmt-form-row').find('label').removeClass('w-text-warning');
                                el.parents('form').find('[name=' + fieldName + ']').removeClass('pmt-form-danger');
                            }
                            if (errShow || custMsg) {
                                var errors = field.$error;
                                var errmsg;
                                for (var error in errors) {
                                    if (errors[error] && errors.hasOwnProperty(error)) {
                                        if (errors[error] && attrs[error]) {
                                            errmsg = attrs[error];
                                        } else if (error === 'required' && attrs.xrequired) {
                                            errmsg = attrs.xrequired;
                                        } else if (errors[error] && msgTable[error]) {
                                            errmsg = msgTable[error];
                                        } else {
                                            errmsg = attrs.validation;
                                        }
                                        if (!errmsg) {
                                            errmsg = '请填写正确的信息';
                                        }
                                    }
                                }
                                if (custMsg) {
                                    errmsg = custMsg;
                                }
                                helpstr = attrs.help || '';
                                html = helpstr + '<span class="pmt-form-help-inline w-text-warning">' + errmsg + '</span>';
                            } else {
                                html = attrs.help || '';
                            }
                            // html && angular.element(el).html(html);
                            angular.element(el).html(html);
                        }
                        $scope.$watch(watchExpr2, checkShowMsg, true);
                        $scope.$watch(watchExpr1, checkShowMsg, true);
                        $scope.$watch(watchCustErrExpr, checkShowMsg, true);
                        $scope.$watch(watchValChangeExpr, function() {
                            var field = $scope[formName][fieldName];
                            if (field && field._custMsg) {
                                delete field._custMsg;
                            }
                        });
                    }
                };
            }
        ])
        .directive('validateSubmit', [

            function($parse) {
                return {
                    restrict: 'A',
                    require: ['?form'],
                    link: function(scope, formElement, attrs) {
                        var form = scope[attrs.name];

                        formElement.bind('submit', function() {
                            angular.forEach(form, function(field, name) {
                                if (typeof(name) === 'string' && !name.match('^[\$]')) {
                                    if (field.$pristine && !field.$viewValue) {
                                        field.$setViewValue('');
                                    }
                                    if (field.$viewValue) {
                                        field.$setViewValue(field.$viewValue);
                                    }
                                }
                            });
                            if (form.$valid) {
                                scope.$apply(attrs.validateSubmit);
                            } else {
                                if (!$('.ng-dirty.ng-invalid').not('form').length) return;
                                $('.ng-dirty.ng-invalid').not('form').eq(0).focus();
                                $('html, body').animate({
                                    scrollTop: $('.ng-dirty.ng-invalid').not('form').eq(0).offset().top - 20
                                });
                            }
                            scope.$apply();
                        });
                    }
                };
            }
        ])
        .directive('inputfield', [

            function() {
                return {
                    restrict: 'AE',
                    replace: true,
                    transclude: true,
                    require: 'ngModel',
                    scope: {
                        labelfor: '@',
                        labeltext: '@'
                    },
                    template: '<div class="pmt-form-row">' +
                        '<label class="pmt-form-label" for="{{labelfor}}">{{ labeltext }}</label>' +
                        '<div class="pmt-form-controls" ng-transclude>' +
                        '</div>'
                };
            }
        ]);
});