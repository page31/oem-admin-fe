define(['app_vertical/services'], function() {
    var app = angular.module('dataApp.controllers', ['pmtBase']);

    // https://docs.google.com/a/wandoujia.com/document/d/1czdHkZiPJMFnEMnvppbhGWLuhG-5xdUPa5vt9lQyr9k/edit
    // Todo support 特定 App 下载量

    var chartOptions = {
        chart: {
            events: {}
        },
        title: {
            text: null
        },
        subtitle: {},
        tooltip: {
            crosshairs: true,
            shared: true
        },
        series: [],
        xAxis: {
            type: 'datetime'
        },
        credits: {},
        navigator: {
            enabled: false
        },
        lang: {
            noData: '没有查询到相关数据'
        },
        noData: {
            style: {
                fontSize: '18px',
                color: '#303030'
            }
        },
        plotOptions: {
            series: {
                connectNulls: true
            }
        }
    };

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
                },
                buzy: 'global'
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
        };

        $scope.$watch('currentReportData', function(v) {
            if (!v) return;
            if (!v.length) return;
            var metricAliasList = '请求量,下载量,收入,分成,DAU,DLU,MAU,启动次数'.split(',');
            var metricNameList = 'requestsCount,downloadCount,profit,share,dayActiveUsers,dayLaunchUsers,monthActiveUsers,launchCount'.split(',');

            $scope.metricsList = _.map(metricAliasList, function(i, idx) {
                return {
                    name: metricNameList[idx],
                    alias: i
                };
            });

            chartOptions.series = _.map($scope.metricsList, function(i) {
                return {
                    pointInterval: 86400000,
                    pointStart: new Date(v[0].date).getTime(),
                    data: _.pluck(v, i.name),
                    name: i.alias
                };
            });
            $('#main-chart').highcharts(chartOptions);
        });

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
                },
                buzy: 'global'
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