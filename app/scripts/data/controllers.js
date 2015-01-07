define(['app_vertical/services'], function() {
    var app = angular.module('dataApp.controllers', ['pmtBase']);

    // https://docs.google.com/a/wandoujia.com/document/d/1czdHkZiPJMFnEMnvppbhGWLuhG-5xdUPa5vt9lQyr9k/edit
    // Todo support 特定 App 下载量

    app.controller('reportCtrl', function($scope, $rootScope, $timeout, apiHelper) {
        $timeout(function() {
            baseDateRangeInit($scope, [moment().subtract('days', 29), moment()]);
            $scope.fetchMetrics();
        });

        $scope.fetchMetrics = function() {
            apiHelper('fetchMetrics', {
                params: {
                    startTime: $scope.startDate,
                    endTime: $scope.endDate
                }
            }).then(function(r) {
                var _dict = {};
                _.each(r, function(i) {
                    _dict[i.tokenId] = i.data;
                });
                $scope.allReportData = _dict;

                if ($scope.$root.currentConfig) {
                    $scope.currentReportData = $scope.allReportData[$scope.$root.currentConfig.alias];
                }
            });
        }

        $rootScope.$watch('currentConfig.alias', function(val) {
            if (!val) return;
            if (!$scope.allReportData) return;
            $scope.currentReportData = $scope.allReportData[val];
        });
    });

    app.controller('appReportCtrl', function($scope, $rootScope, $timeout, apiHelper) {
        $timeout(function() {
            baseDateRangeInit($scope, [moment().subtract('days', 29), moment()]);
            $scope.fetchAppDown();
        });

        $scope.fetchAppDown = function() {
            apiHelper('fetchAppDown', {
                params: {
                    startTime: $scope.startDate,
                    endTime: $scope.endDate
                }
            }).then(function(r) {
                var _dict = {};
                _.each(r, function(i) {
                    _dict[i.tokenId] = i.data;
                });
                $scope.allAppReport = _dict;
                if ($scope.$root.currentConfig) {
                    $scope.currentAppReport = $scope.allAppReport[$scope.$root.currentConfig.alias];
                }
            });
        };

        $rootScope.$watch('currentConfig.alias', function(val) {
            if (!val) return;
            if (!$scope.allAppReport) return;
            $scope.currentAppReport = $scope.allAppReport[val];
        });
    });
});