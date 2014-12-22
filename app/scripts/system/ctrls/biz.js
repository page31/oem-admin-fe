define([], function() {
    var systemApp = angular.module('systemApp.bizCtrl', ['pmtBase']);

    systemApp.controller('systemPartnerCtrl', function($scope, apiHelper) {
        apiHelper('fetchTokenMeta').then(function(r) {
            $scope.$root.tokenMeta = r;
        });
        apiHelper('fetchApiPartners').then(function(r) {
            $scope.apiPartnerList = r.beans;
        });
        apiHelper('fetchOemPartners').then(function(r) {
            $scope.oemPartnerList = r.beans;
        });
    });

    systemApp.controller('systemAccountCtrl', function($scope, apiHelper) {

        apiHelper('fetchAuthMeta', {
            busy: 'global'
        }).then(function(r) {
            // process hook for auth meta
            _.each(r.authorizedItems.authorizedLevel2, function(val, key) {
                r.authorizedItems.authorizedLevel1[key].children = val;
            });
            $scope.$root.authMeta = r;
        });

        apiHelper('fetchAuths').then(function(r) {
            $scope.authList = r.beans;
        });

        $scope.tableData = [
            ['daniel@wandoujia.com', ' 内部运营', '无', 4],
            ['daniel@wandoujia.com', ' 内部运营', '无', 5]
        ];
    });

    systemApp.controller('systemStatusCtrl', function($scope, apiHelper) {
        apiHelper('fetchQuota', {
            params: {
                configAlias: 'antutu'
            }
        }).then(function(r) {
            $scope.tableData = _.map2Arr(r, ['name', 'totalCount', 'usedCount', 'nextReset']);
        });
    });

    systemApp.controller('systemLogCtrl', function($scope, apiHelper) {
        apiHelper('fetchLog', {
            params: {
                startTime: 12345667889,
                endTime: 1418788349261
            }
        }).then(function(r) {
            $scope.tableData = _.map2Arr(r.beans, ['timeStamp', 'username', 'content']);
        });
    });

    systemApp.controller('systemColumnCtrl', function($scope) {
        $scope.tableData = [
            ['华硕', '华硕周周 Zen 项', '']
        ];
    });
})