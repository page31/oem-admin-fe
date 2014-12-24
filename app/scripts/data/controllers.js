define(['app_vertical/services'], function() {
    var app = angular.module('dataApp.controllers', ['classy']);

    // https://docs.google.com/a/wandoujia.com/document/d/1czdHkZiPJMFnEMnvppbhGWLuhG-5xdUPa5vt9lQyr9k/edit
    // Todo support 特定 App 下载量

    setTimeout(function() {
        $('#reportrange').daterangepicker();
    }, 1000);

    var reportCtrl = {
        name: 'reportCtrl',
        inject: ['$scope', '$rootScope', 'dataService', '$filter', '$routeParams', '$q', '$filter', '$timeout'],
        init: function() {
            var $scope = this.$,
                $rootScope = this.$rootScope;
            $scope.exportDataHandler = function() {};

            $rootScope.dateRangeStart = function() {
                var endInput = $(this).data('input').parent().find('input').eq(1);
                this.setOptions({
                    maxDate: endInput.val() ? endInput.val() : false
                });
            };

            $scope.endDate = new Date() - 3600 * 24 * 1000;
            $scope.startDate = new Date() - 8 * 3600 * 24 * 1000;
            $scope.dataQueryHandler();
        },
        dataQueryHandler: function() {
            var $scope = this.$,
                $routeParams = this.$routeParams,
                $q = this.$q;
            $q.all([
                this.dataService.fetchReportData($scope.startDate, $scope.endDate),
                this.dataService.fetchReportAppDownloadData($scope.startDate, $scope.endDate)
            ]).then(function(arr) {
                $scope.reportData = arr[0];
                $scope.reportAppDownloadData = arr[1];
                if ($routeParams.alias) {
                    $scope.currentReport = _.find(arr[0], function(item) {
                        return item.tokenId === $routeParams.alias;
                    });
                    $scope.currentAppDownloadReport = _.find(arr[1], function(item) {
                        return item.tokenId === $routeParams.alias;
                    });
                } else {
                    $scope.currentReport = arr[0][0];
                    $scope.currentAppDownloadReport = arr[1][0];
                }
            });
        },
        exportCSV: function() {
            var $scope = this.$,
                $filter = this.$filter,
                $timeout = this.$timeout;

            function buildCsvName() {
                return _.template('WDJ-<%= name %>-<%= startDate %>_<%= endDate %>_DATA', {
                    name: $scope.currentReport.tokenId,
                    startDate: $filter('date')($scope.startDate, 'yyyymmdd'),
                    endDate: $filter('date')($scope.endDate, 'yyyymmdd')
                });
            }

            function buildCsvContent($table) {
                var csv;
                var $rows = $table.find('tr'),
                    tmpColDelim = String.fromCharCode(11), // vertical tab character
                    tmpRowDelim = String.fromCharCode(0), // null character

                    // actual delimiter characters for CSV format
                    colDelim = '","',
                    rowDelim = '"\r\n"',

                    // Grab text from table into CSV formatted string
                    csv = '"' + $rows.map(function(i, row) {
                        var $row = $(row),
                            $cols = $row.find('td,th');

                        return $cols.map(function(j, col) {
                            var $col = $(col),
                                text = $col.text();

                            return text.replace('"', '""'); // escape double quotes

                        }).get().join(tmpColDelim);

                    }).get().join(tmpRowDelim)
                        .split(tmpRowDelim).join(rowDelim)
                        .split(tmpColDelim).join(colDelim) + '"';

                return URL.createObjectURL(new Blob([csv], {
                    type: 'text/csv'
                }));
            }

            function exportTableCsv(table) {
                var link = document.createElement("a");
                link.href = buildCsvContent(table);
                link.download = buildCsvName();
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            _.each($('table:visible'), function(table) {
                $timeout(function() {
                    exportTableCsv($(table));
                }, 400);
            });
        }
    };

    var usageCtrl = {
        name: 'usageCtrl',
        inject: ['$scope', '$routeParams', 'dataService'],
        init: function() {
            var $scope = this.$scope;
            this.dataService.fetchQuota().then(function(data) {
                console.log(data);
                $scope.quotas = data;
            });
        }
    };

    var ctrls = [reportCtrl, usageCtrl];
    _.each(ctrls, function(ctrl) {
        app.classy.controller(ctrl);
    });
    return app;
});