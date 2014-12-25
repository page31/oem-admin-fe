define(['app_vertical/services'], function() {
    var app = angular.module('dataApp.controllers', ['pmtBase']);

    // https://docs.google.com/a/wandoujia.com/document/d/1czdHkZiPJMFnEMnvppbhGWLuhG-5xdUPa5vt9lQyr9k/edit
    // Todo support 特定 App 下载量

    setTimeout(function() {
        $('#reportrange').daterangepicker();
    }, 1000);

    app.controller('reportCtrl', function($scope, $rootScope, $timeout, apiHelper) {
        apiHelper('fetchMetrics', {
            startTime: '12345667889',
            endTime: '1418788349261'
        }).then(function(r) {
            console.log(r);
        });
    });

    app.controller('appReportCtrl', function($scope, $rootScope, $timeout, apiHelper) {
        apiHelper('fetchAppDown', {
            startTime: '12345667889',
            endTime: '1418788349261'
        }).then(function(r) {
            console.log(r);
        });
    });
});