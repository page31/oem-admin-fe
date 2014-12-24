define([], function() {
    var systemApp = angular.module('systemApp.baseCtrl', ['pmtBase']);
    systemApp.controller('systemCtrl', function($scope, formlyHelper, apiHelper) {
        // extract to i18n
        $scope.menuList = systemMenuList;
        var DelHandlerMap = {};

        $scope.FORMMAP = {};
        $scope.DelHandlerMap = DelHandlerMap;

        var FORMMAP = $scope.FORMMAP;

        apiHelper('fetchAuthMeta').then(function(r) {
            // process hook for auth meta
            _.each(r.authorizedItems.authorizedLevel2, function(val, key) {
                r.authorizedItems.authorizedLevel1[key].children = val;
            });
            $scope.$root.authMeta = r;
        });

        // Todo: 为什么 child 访问不到？！
        $scope.$root.onSet = function(type, item, ex) {
            // BeforeTransformerMap[type] && BeforeTransformerMap[type](item, ex);
            formlyHelper.openModal(FORMMAP[type], item, ex);
        };
        $scope.$root.onEdit = $scope.$root.onSet;
        $scope.$root.onAdd = function(type, item, ex) {
            formlyHelper.openModal(FORMMAP[type], item, ex);
        };
        $scope.$root.onDel = function(type, item, scope) {
            if (window.confirm('您确定要删除该资源吗？')) {
                FORMMAP[type].del && FORMMAP[type].del(item, scope);
            }
        };
    });
});